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
                let lines = text.split('\n');
                let regex = new RegExp(input, 'g');
                let indexes : number[][] = [];
                let matchedTexts : string[][] = [];
                let plainTexts : string[][] = [];
                for(let i = 0; i < lines.length; i++) {
                    let line = lines[i];
                    indexes[i] = [];
                    matchedTexts[i] = [];
                    let result;
                    while ((result = regex.exec(line)) !== null) {
                        indexes[i].push(regex.lastIndex);
                        matchedTexts[i].push(result[0]);
                    }
                    plainTexts[i] = [];
                    if(indexes[i].length > 0) {
                        plainTexts[i].push(line.substring(0, indexes[i][0] - 1));
                        for(let j = 0; j < indexes[i].length - 1; j++) {
                            plainTexts[i].push(line.substring(indexes[i][j] + matchedTexts[i][j].length - 1, indexes[i][j+1] - 1));
                        }
                        if(indexes[i].length > 0) {
                            plainTexts[i].push(line.substring(indexes[i][indexes[i].length - 1] + matchedTexts[i][indexes[i].length - 1].length - 1, line.length - 1));
                        }
                    }
                }
                console.log(indexes);
                console.log(matchedTexts);
                console.log(plainTexts);
                console.log('');


            }
        }
    });
    context.subscriptions.push(alignByRegex);
}

// this method is called when your extension is deactivated
export function deactivate() {
}