import { Line } from './line';
import { Part, PartType } from './Part';
import { trimEndButOne, trimButOne, trimStartButOne, extendToLength, trimEnd } from './string-utils';
import * as vscode from 'vscode';

export class Block {

    lines: Line[] = [];

    constructor(text: string, input: string, startLine: number, eol: vscode.EndOfLine) {
        let splitString : string;
        if(eol === vscode.EndOfLine.CRLF) {
            splitString = '\r\n';
        } else {
            splitString = '\n';
        }
        let textLines = text.split(splitString);
        let regex = new RegExp(input, 'g');
        for (let i = 0; i < textLines.length; i++) {
            let lineText = textLines[i];
            let lineObject = { number: startLine + i, parts: [] as Part[] };
            let result;
            let textStartPosition = 0;
            while ((result = regex.exec(lineText)) !== null) {
                let regexStartPosition = regex.lastIndex - result[0].length;
                lineObject.parts.push({ type: PartType.Text, value: lineText.substring(textStartPosition, regexStartPosition) });
                lineObject.parts.push({ type: PartType.Regex, value: result[0] });
                textStartPosition = regex.lastIndex;
            }
            lineObject.parts.push({ type: PartType.Text, value: lineText.substring(textStartPosition, lineText.length) });
            this.lines.push(lineObject);
        }
    }

    trim(): Block {
        for (let line of this.lines) {
            for (let i = 0; i < line.parts.length; i++) {
                let part = line.parts[i];
                if (i === 0) {
                    part.value = trimEndButOne(part.value);
                } else if (i < line.parts.length - 1) {
                    part.value = trimButOne(part.value);
                } else {
                    let intermediate = trimStartButOne(part.value)
                    part.value = trimEnd(intermediate);
                }
            }
        }
        return this;
    }

    align(): Block {
        let nLines : number = this.lines.length;

        /* create array with the right size and initialize array with 0 */
        let maxLength : number[] = Array(nLines).fill(0);
        for (let line of this.lines) {
            // no match, only one part => ignore line in max length calculation
            if (line.parts.length > 1) {
                for (let i = 0; i < line.parts.length; i++) {
                    maxLength[i] = Math.max(maxLength[i], line.parts[i].value.length);
                }
            }
        }
        for (let line of this.lines) {
            for (let i = 0; i < line.parts.length - 1; i++) {
                line.parts[i].value = extendToLength(line.parts[i].value, maxLength[i]);
            }
        }
        return this;
    }
}