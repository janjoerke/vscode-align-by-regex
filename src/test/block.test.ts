import { Block } from '../block';
import * as assert from 'assert';
import * as vscode from 'vscode';

suite("Block Tests", function () {

    test("Test constructor", function() {
        let text = `a.a.a
bb.bb
ccc.
.ddd
e..e`;
        let input = '\\.';
        let startLine = 0;
        let block : Block = new Block(text, input, startLine, vscode.EndOfLine.LF);

        assert(block.lines.length === 5);
        
        assert(block.lines[0].number === 0);
        assert(block.lines[0].parts.length === 5);
        // assert(block.lines[0].parts[0].position === 0);
        assert(block.lines[0].parts[0].value === 'a');
        // assert(block.lines[0].parts[1].position === 1);
        assert(block.lines[0].parts[1].value === '.');
        // assert(block.lines[0].parts[2].position === 2);
        assert(block.lines[0].parts[2].value === 'a');
        // assert(block.lines[0].parts[3].position === 3);
        assert(block.lines[0].parts[3].value === '.');
        // assert(block.lines[0].parts[4].position === 4);
        assert(block.lines[0].parts[4].value === 'a');
        
        assert(block.lines[1].number === 1);
        assert(block.lines[1].parts.length === 3);
        // assert(block.lines[1].parts[0].position === 0);
        assert(block.lines[1].parts[0].value === 'bb');
        // assert(block.lines[1].parts[1].position === 2);
        assert(block.lines[1].parts[1].value === '.');
        // assert(block.lines[1].parts[2].position === 3);
        assert(block.lines[1].parts[2].value === 'bb');
        
        assert(block.lines[2].number === 2);
        assert(block.lines[2].parts.length === 3);
        // assert(block.lines[2].parts[0].position === 0);
        assert(block.lines[2].parts[0].value === 'ccc');
        // assert(block.lines[2].parts[1].position === 3);
        assert(block.lines[2].parts[1].value === '.');
        // assert(block.lines[2].parts[2].position === 4);
        assert(block.lines[2].parts[2].value === '');
        
        assert(block.lines[3].number === 3);
        assert(block.lines[3].parts.length === 3);
        // assert(block.lines[3].parts[0].position === 0);
        assert(block.lines[3].parts[0].value === '');
        // assert(block.lines[3].parts[1].position === 0);
        assert(block.lines[3].parts[1].value === '.');
        // assert(block.lines[3].parts[2].position === 1);
        assert(block.lines[3].parts[2].value === 'ddd');

        assert(block.lines[4].number === 4);
        assert(block.lines[4].parts.length === 5);
        // assert(block.lines[4].parts[0].position === 0);
        assert(block.lines[4].parts[0].value === 'e');
        // assert(block.lines[4].parts[1].position === 1);
        assert(block.lines[4].parts[1].value === '.');
        // assert(block.lines[4].parts[2].position === 2);
        assert(block.lines[4].parts[2].value === '');
        // assert(block.lines[4].parts[3].position === 2);
        assert(block.lines[4].parts[3].value === '.');
        // assert(block.lines[4].parts[4].position === 3);
        assert(block.lines[4].parts[4].value === 'e');
    });

    test("Test trim", function() {
        let text = `a   . a   .a
    bb.bb    `;
        let input = '\\.';
        let startLine = 0;
        let block : Block = new Block(text, input, startLine, vscode.EndOfLine.LF).trim();

        assert(block.lines.length === 2);
        
        assert(block.lines[0].number === 0);
        assert(block.lines[0].parts.length === 5);
        assert(block.lines[0].parts[0].value === 'a ');
        assert(block.lines[0].parts[1].value === '.');
        assert(block.lines[0].parts[2].value === ' a ');
        assert(block.lines[0].parts[3].value === '.');
        assert(block.lines[0].parts[4].value === 'a');
        
        assert(block.lines[1].number === 1);
        assert(block.lines[1].parts.length === 3);
        assert(block.lines[1].parts[0].value === '    bb');
        assert(block.lines[1].parts[1].value === '.');
        assert(block.lines[1].parts[2].value === 'bb');
    });

    test("Test align", function() {
        let text = `a   . a   .a
    bb.bb    `;
        let input = '\\.';
        let startLine = 0;
        let block : Block = new Block(text, input, startLine, vscode.EndOfLine.LF).trim().align();

        assert(block.lines.length === 2);
        
        assert(block.lines[0].number === 0);
        assert(block.lines[0].parts.length === 5);
        assert(block.lines[0].parts[0].value === 'a     ');
        assert(block.lines[0].parts[1].value === '.');
        assert(block.lines[0].parts[2].value === ' a ');
        assert(block.lines[0].parts[3].value === '.');
        assert(block.lines[0].parts[4].value === 'a');
        
        assert(block.lines[1].number === 1);
        assert(block.lines[1].parts.length === 3);
        assert(block.lines[1].parts[0].value === '    bb');
        assert(block.lines[1].parts[1].value === '.');
        assert(block.lines[1].parts[2].value === 'bb');
    });

});