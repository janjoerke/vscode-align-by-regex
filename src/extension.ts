'use strict';
import { Block } from './block';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    let lastInput: string;

    let alignByRegex = vscode.commands.registerTextEditorCommand('align.by.regex', async (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, args: any[]) => {
        let templates = vscode.workspace.getConfiguration().get('align.by.regex.templates');
        let input = await vscode.window.showInputBox({ prompt: 'Enter regular expression or template name.', value: lastInput });
        if (input !== undefined && input.length > 0) {
            lastInput = input;
            if (templates !== undefined) {
                let template = (<any>templates)[input];
                if(template !== undefined) {
                    input = template as string;
                }
            }
            let selection: vscode.Selection = textEditor.selection;
            if (!selection.isEmpty) {
                let textDocument = textEditor.document;
                
                // Don't select last line, if no character of line is selected.
                let endLine = selection.end.line;
                let endPosition = selection.end;
                if(endPosition.character === 0) {
                    endLine--;
                }
                
                let range = new vscode.Range(new vscode.Position(selection.start.line, 0), new vscode.Position(endLine, textDocument.lineAt(endLine).range.end.character));
                let text = textDocument.getText(range);
                let block: Block = new Block(text, input, selection.start.line, textDocument.eol).trim().align();
                await textEditor.edit(e => {
                    for (let line of block.lines) {
                        let deleteRange = new vscode.Range(new vscode.Position(line.number, 0), new vscode.Position(line.number, textDocument.lineAt(line.number).range.end.character));
                        let replacement: string = '';
                        for (let part of line.parts) {
                            replacement += part.value;
                        }
                        e.replace(deleteRange, replacement);
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