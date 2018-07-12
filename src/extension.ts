'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    let lastInput : string;

    let alignByRegex = vscode.commands.registerTextEditorCommand('align.by.regex', async (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, args: any[]) => {
        let input = await vscode.window.showInputBox({prompt: 'Enter RegEx.', value: lastInput});
        if(input !== undefined) {
            lastInput = input;
            let selection : vscode.Selection = textEditor.selection;
            if(!selection.isEmpty) {
                let textDocument = textEditor.document;
                let range = new vscode.Range(new vscode.Position(selection.start.line, 0), new vscode.Position(selection.end.line, textDocument.lineAt(selection.end.line).range.end.character));
                let text = textDocument.getText(range);
                let lines = text.split('\r\n');
                let regex = new RegExp(input, 'g');
                let regexIndexes : number[][] = [];
                let regexs : string[][] = [];
                let textIndexes : number[][] = [];
                let texts : string[][] = [];
                for(let i = 0; i < lines.length; i++) {
                    let line = lines[i];
                    regexs[i] = [];
                    regexIndexes[i] = [];
                    texts[i] = [];
                    textIndexes[i] = [];
                    let result;
                    while ((result = regex.exec(line)) !== null) {
                        regexIndexes[i].push(regex.lastIndex - 1);
                        regexs[i].push(result[0]);
                    }

                    if(regexIndexes[i].length > 0) {
                        let firstCharacterMatches = regexIndexes[i][0] === 0;
                        let endOfFirstPlainText = regexIndexes[i][0];
                        let startOfLastPlainText = regexIndexes[i][regexIndexes[i].length - 1] + regexs[i][regexIndexes[i].length - 1].length;
                        
                        if(!firstCharacterMatches) {
                            texts[i].push(line.substring(0, endOfFirstPlainText));
                            textIndexes[i].push(0);
                        }
                        for(let j = 0; j < regexIndexes[i].length - 1; j++) {
                            let startOfText = regexIndexes[i][j] + regexs[i][j].length;
                            let endOfText = regexIndexes[i][j+1];
                            texts[i].push(line.substring(startOfText, endOfText));
                            textIndexes[i].push(startOfText);
                        }
                        if(startOfLastPlainText < line.length) {
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

                let mergedTexts : string[][] = [];
                
            }
        }
    });
    context.subscriptions.push(alignByRegex);
}

// this method is called when your extension is deactivated
export function deactivate() {
}