'use strict';
import * as vscode from 'vscode';
import { Part, PartType } from './Part';

export function activate(context: vscode.ExtensionContext) {

    let lastInput: string;

    let alignByRegex = vscode.commands.registerTextEditorCommand('align.by.regex', async (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, args: any[]) => {
        let input = await vscode.window.showInputBox({ prompt: 'Enter RegEx.', value: lastInput });
        if (input !== undefined) {
            lastInput = input;
            let selection: vscode.Selection = textEditor.selection;
            if (!selection.isEmpty) {
                let textDocument = textEditor.document;
                let range = new vscode.Range(new vscode.Position(selection.start.line, 0), new vscode.Position(selection.end.line, textDocument.lineAt(selection.end.line).range.end.character));
                let text = textDocument.getText(range);
                let lines = text.split('\r\n');
                let regex = new RegExp(input, 'g');
                let regexIndexes: number[][] = [];
                let regexs: string[][] = [];
                let textIndexes: number[][] = [];
                let texts: string[][] = [];
                let parts: Part[][] = [];
                for (let i = 0; i < lines.length; i++) {
                    let line = lines[i];
                    regexs[i] = [];
                    regexIndexes[i] = [];
                    texts[i] = [];
                    textIndexes[i] = [];
                    parts[i] = [];
                    let result;
                    while ((result = regex.exec(line)) !== null) {
                        regexIndexes[i].push(regex.lastIndex - 1);
                        regexs[i].push(result[0]);
                    }

                    if (regexIndexes[i].length > 0) {
                        let firstCharacterMatches = regexIndexes[i][0] === 0;
                        let endOfFirstPlainText = regexIndexes[i][0];
                        let startOfLastPlainText = regexIndexes[i][regexIndexes[i].length - 1] + regexs[i][regexIndexes[i].length - 1].length;

                        if (!firstCharacterMatches) {
                            texts[i].push(line.substring(0, endOfFirstPlainText));
                            textIndexes[i].push(0);
                        }
                        for (let j = 0; j < regexIndexes[i].length - 1; j++) {
                            let startOfText = regexIndexes[i][j] + regexs[i][j].length;
                            let endOfText = regexIndexes[i][j + 1];
                            texts[i].push(line.substring(startOfText, endOfText));
                            textIndexes[i].push(startOfText);
                        }
                        if (startOfLastPlainText < line.length) {
                            texts[i].push(line.substring(startOfLastPlainText, line.length));
                            textIndexes[i].push(startOfLastPlainText);
                        }
                    } else {
                        texts[i].push(line);
                        textIndexes[i].push(0);
                    }
                }
                console.log(regexs);
                console.log(regexIndexes);
                console.log(texts);
                console.log(textIndexes);
                console.log('');

                let maxRegexPerLine = 0;
                for (let i = 0; i < lines.length; i++) {
                    maxRegexPerLine = Math.max(maxRegexPerLine, regexIndexes[i].length);
                }

                // Merge regexs and texts
                for (let i = 0; i < lines.length; i++) {
                    regexs[i].reverse();
                    regexIndexes[i].reverse();
                    texts[i].reverse();
                    textIndexes[i].reverse();
                    let regexIndex = - 1;
                    let textIndex = -1;
                    while (regexIndex > -2 || textIndex > -2) {
                        if (regexIndexes[i].length > 0 && regexIndex === -1) {
                            regexIndex = regexIndexes[i].pop() as number;
                        }
                        if (textIndexes[i].length > 0 && textIndex === -1) {
                            textIndex = textIndexes[i].pop() as number;
                        }
                        let part: Part;
                        if (regexIndex !== -2 && textIndex !== -2) {
                            if (regexIndex < textIndex) {
                                let regex = regexs[i].pop() as string;
                                part = { type: PartType.Regex, position: regexIndex, value: regex, length: regex.length };
                                if (regexIndexes[i].length > 0) {
                                    regexIndex = regexIndexes[i].pop() as number;
                                } else {
                                    regexIndex = -2;
                                }
                            } else {
                                let text = texts[i].pop() as string;
                                part = { type: PartType.Text, position: textIndex, value: text, length: text.length };
                                if (textIndexes[i].length > 0) {
                                    textIndex = textIndexes[i].pop() as number;
                                } else {
                                    textIndex = -2;
                                }
                            }
                        } else if (regexIndex !== -2) {
                            let regex = regexs[i].pop() as string;
                            part = { type: PartType.Regex, position: regexIndex, value: regex, length: regex.length };
                            if (regexIndexes[i].length > 0) {
                                regexIndex = regexIndexes[i].pop() as number;
                            } else {
                                regexIndex = -2;
                            }
                        } else {
                            let text = texts[i].pop() as string;
                            part = { type: PartType.Text, position: textIndex, value: text, length: text.length };
                            if (textIndexes[i].length > 0) {
                                textIndex = textIndexes[i].pop() as number;
                            } else {
                                textIndex = -2;
                            }
                        }
                        // Fill up with empty text blocks
                        if (part.type === PartType.Regex && (parts[i].length === 0 || parts[i][parts[i].length - 1].type === PartType.Regex)) {
                            parts[i].push({ type: PartType.Text, position: part.position, value: '', length: 0 });
                        }
                        parts[i].push(part);
                    }
                }

                console.log(parts);

                let maxPartLengths: number[] = [];
                for (let i = 0; i < parts.length; i++) {
                    for (let j = 0; j < parts[i].length; j++) {
                        if (maxPartLengths.length < j + 1) {
                            maxPartLengths.push(0);
                            maxPartLengths[j] = Math.max(maxPartLengths[j], parts[i][j].length);
                        }
                    }
                }

                let startLine = selection.start.line;
                await textEditor.edit(e => {
                    for (let i = 0; i < lines.length; i++) {
                        let lineNumber = startLine + i;
                        let deleteRange = new vscode.Range(new vscode.Position(lineNumber, 0), new vscode.Position(lineNumber, textDocument.lineAt(lineNumber).range.end.character));
                        e.delete(deleteRange);
                    }
                });

                await textEditor.edit(e => {
                    for (let i = 0; i < lines.length; i++) {
                        let lineNumber = startLine + i;
                        let offset = 0;
                        for(let j = 0; j < parts[i].length; j++) {
                            let part = parts[i][j];
                            let insertPosition = new vscode.Position(lineNumber, part.position + offset);
                            offset = offset + maxPartLengths[j];
                            e.insert(insertPosition, part.value);
                        }
                    }
                });
            }
        }
    });
    context.subscriptions.push(alignByRegex);
}

// this method is called when your extension is deactivated
export function deactivate() {
}