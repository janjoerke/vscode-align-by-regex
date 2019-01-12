import { Block } from '../block';
import { Line } from '../line';
import * as assert from 'assert';
import * as vscode from 'vscode';

function concatLineParts(line : Line) : string {
    return line.parts.map(p => p.value).join('');
}

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

        assert.deepEqual(block.lines.length, 5);

        assert.deepEqual(block.lines[0].number, 0);
        assert.deepEqual(block.lines[0].parts.length, 5);
        // assert.deepEqual(block.lines[0].parts[0].position, 0);
        assert.deepEqual(block.lines[0].parts[0].value, 'a');
        // assert.deepEqual(block.lines[0].parts[1].position, 1);
        assert.deepEqual(block.lines[0].parts[1].value, '.');
        // assert.deepEqual(block.lines[0].parts[2].position, 2);
        assert.deepEqual(block.lines[0].parts[2].value, 'a');
        // assert.deepEqual(block.lines[0].parts[3].position, 3);
        assert.deepEqual(block.lines[0].parts[3].value, '.');
        // assert.deepEqual(block.lines[0].parts[4].position, 4);
        assert.deepEqual(block.lines[0].parts[4].value, 'a');

        assert.deepEqual(block.lines[1].number, 1);
        assert.deepEqual(block.lines[1].parts.length, 3);
        // assert.deepEqual(block.lines[1].parts[0].position, 0);
        assert.deepEqual(block.lines[1].parts[0].value, 'bb');
        // assert.deepEqual(block.lines[1].parts[1].position, 2);
        assert.deepEqual(block.lines[1].parts[1].value, '.');
        // assert.deepEqual(block.lines[1].parts[2].position, 3);
        assert.deepEqual(block.lines[1].parts[2].value, 'bb');

        assert.deepEqual(block.lines[2].number, 2);
        assert.deepEqual(block.lines[2].parts.length, 3);
        // assert.deepEqual(block.lines[2].parts[0].position, 0);
        assert.deepEqual(block.lines[2].parts[0].value, 'ccc');
        // assert.deepEqual(block.lines[2].parts[1].position, 3);
        assert.deepEqual(block.lines[2].parts[1].value, '.');
        // assert.deepEqual(block.lines[2].parts[2].position, 4);
        assert.deepEqual(block.lines[2].parts[2].value, '');

        assert.deepEqual(block.lines[3].number, 3);
        assert.deepEqual(block.lines[3].parts.length, 3);
        // assert.deepEqual(block.lines[3].parts[0].position, 0);
        assert.deepEqual(block.lines[3].parts[0].value, '');
        // assert.deepEqual(block.lines[3].parts[1].position, 0);
        assert.deepEqual(block.lines[3].parts[1].value, '.');
        // assert.deepEqual(block.lines[3].parts[2].position, 1);
        assert.deepEqual(block.lines[3].parts[2].value, 'ddd');

        assert.deepEqual(block.lines[4].number, 4);
        assert.deepEqual(block.lines[4].parts.length, 5);
        // assert.deepEqual(block.lines[4].parts[0].position, 0);
        assert.deepEqual(block.lines[4].parts[0].value, 'e');
        // assert.deepEqual(block.lines[4].parts[1].position, 1);
        assert.deepEqual(block.lines[4].parts[1].value, '.');
        // assert.deepEqual(block.lines[4].parts[2].position, 2);
        assert.deepEqual(block.lines[4].parts[2].value, '');
        // assert.deepEqual(block.lines[4].parts[3].position, 2);
        assert.deepEqual(block.lines[4].parts[3].value, '.');
        // assert.deepEqual(block.lines[4].parts[4].position, 3);
        assert.deepEqual(block.lines[4].parts[4].value, 'e');
    });

    test("Test trim", function() {
        let text = `a   . a   .a
    bb.bb    `;
        let input = '\\.';
        let startLine = 0;
        let block : Block = new Block(text, input, startLine, vscode.EndOfLine.LF).trim();

        assert.deepEqual(block.lines.length, 2);

        assert.deepEqual(block.lines[0].number, 0);
        assert.deepEqual(block.lines[0].parts.length, 5);
        assert.deepEqual(block.lines[0].parts[0].value, 'a ');
        assert.deepEqual(block.lines[0].parts[1].value, '.');
        assert.deepEqual(block.lines[0].parts[2].value, ' a ');
        assert.deepEqual(block.lines[0].parts[3].value, '.');
        assert.deepEqual(block.lines[0].parts[4].value, 'a');

        assert.deepEqual(block.lines[1].number, 1);
        assert.deepEqual(block.lines[1].parts.length, 3);
        assert.deepEqual(block.lines[1].parts[0].value, '    bb');
        assert.deepEqual(block.lines[1].parts[1].value, '.');
        assert.deepEqual(block.lines[1].parts[2].value, 'bb');
    });

    test("Test align", function() {
        let text = `a   . a   .a
    bb.bb    `;
        let input = '\\.';
        let startLine = 0;
        let block : Block = new Block(text, input, startLine, vscode.EndOfLine.LF).trim().align();

        assert.deepEqual(block.lines.length, 2);

        assert.deepEqual(block.lines[0].number, 0);
        assert.deepEqual(block.lines[0].parts.length, 5);
        assert.deepEqual(block.lines[0].parts[0].value, 'a     ');
        assert.deepEqual(block.lines[0].parts[1].value, '.');
        assert.deepEqual(block.lines[0].parts[2].value, ' a ');
        assert.deepEqual(block.lines[0].parts[3].value, '.');
        assert.deepEqual(block.lines[0].parts[4].value, 'a');

        assert.deepEqual(block.lines[1].number, 1);
        assert.deepEqual(block.lines[1].parts.length, 3);
        assert.deepEqual(block.lines[1].parts[0].value, '    bb');
        assert.deepEqual(block.lines[1].parts[1].value, '.');
        assert.deepEqual(block.lines[1].parts[2].value, 'bb');
    });

    /* spacing at the end of longer lines is a problem, need to correct it. */
    test("Test align spacing 1", function() {
        let text = `I'm gonna pop some tags
Only got twenty dollars in my pocket
I'm, I'm, I'm hunting, looking for a come up
This is fucking awesome.`;
        let input = '\'';
        let startLine = 0;

        /* regex partioning appears to work normally */
        let blockUnaligned : Block = new Block(text, input, startLine, vscode.EndOfLine.LF);

        /* this is where the spacing on the last part goes away */
        let blockTrimmed = blockUnaligned.trim();

        /* this is probably fine again */
        let block = blockTrimmed.align();

        assert.deepEqual(block.lines.length, 4);

        let currentLine = 0;
        assert.deepEqual(block.lines[currentLine].number, currentLine);
        assert.deepEqual(block.lines[currentLine].parts.length, 3);
        assert.deepEqual(concatLineParts(block.lines[currentLine]), 'I                                   \'m gonna pop some tags');

        currentLine++;
        assert.deepEqual(block.lines[currentLine].number, currentLine);
        assert.deepEqual(block.lines[currentLine].parts.length, 1);
        assert.deepEqual(concatLineParts(block.lines[currentLine]), 'Only got twenty dollars in my pocket');

        currentLine++;
        assert.deepEqual(block.lines[currentLine].number, currentLine);
        assert.deepEqual(block.lines[currentLine].parts.length, 7);
        assert.deepEqual(concatLineParts(block.lines[currentLine]), 'I                                   \'m, I                 \'m, I\'m hunting, looking for a come up');

        currentLine++;
        assert.deepEqual(block.lines[currentLine].number, currentLine);
        assert.deepEqual(block.lines[currentLine].parts.length, 1);
        assert.deepEqual(concatLineParts(block.lines[currentLine]), 'This is fucking awesome.');
    });

    test("Test align spacing 2", function() {
        let text = `a    a(aaa)
b   b(bbbb)
c  c(c)
d d(ddddddd)`;
        let input = '\\)';
        let startLine = 0;

        let blockUnaligned : Block = new Block(text, input, startLine, vscode.EndOfLine.LF);

        let blockTrimmed = blockUnaligned.trim();

        let block = blockTrimmed.align();

        assert.deepEqual(block.lines.length, 4);

        let currentLine = 0;
        assert.deepEqual(block.lines[currentLine].number, currentLine);
        assert.deepEqual(block.lines[currentLine].parts.length, 3);
        assert.deepEqual(concatLineParts(block.lines[currentLine]), 'a    a(aaa )');

        currentLine++;
        assert.deepEqual(block.lines[currentLine].number, currentLine);
        assert.deepEqual(block.lines[currentLine].parts.length, 3);
        assert.deepEqual(concatLineParts(block.lines[currentLine]), 'b   b(bbbb )');

        currentLine++;
        assert.deepEqual(block.lines[currentLine].number, currentLine);
        assert.deepEqual(block.lines[currentLine].parts.length, 3);
        assert.deepEqual(concatLineParts(block.lines[currentLine]), 'c  c(c     )');

        currentLine++;
        assert.deepEqual(block.lines[currentLine].number, currentLine);
        assert.deepEqual(block.lines[currentLine].parts.length, 3);
        assert.deepEqual(concatLineParts(block.lines[currentLine]), 'd d(ddddddd)');
    });

    test("Ignore non-matching lines.", function() {
        let text = `function blah() { "hi there" }
# This function does amazing things the likes of which you have never seen.
function longerfunc() { "hi there" }`;
        let input = '\{';
        let startLine = 0;

        let blockUnaligned : Block = new Block(text, input, startLine, vscode.EndOfLine.LF);

        let blockTrimmed = blockUnaligned.trim();

        let block = blockTrimmed.align();

        assert.deepEqual(block.lines.length, 3);

        let currentLine = 0;
        assert.deepEqual(block.lines[currentLine].number, currentLine);
        assert.deepEqual(block.lines[currentLine].parts.length, 3);
        assert.deepEqual(concatLineParts(block.lines[currentLine]), 'function blah()       { "hi there"}');

        currentLine++;
        assert.deepEqual(block.lines[currentLine].number, currentLine);
        assert.deepEqual(block.lines[currentLine].parts.length, 1);
        assert.deepEqual(concatLineParts(block.lines[currentLine]), '// This function does amazing things the likes of which you have never seen.');

        currentLine++;
        assert.deepEqual(block.lines[currentLine].number, currentLine);
        assert.deepEqual(block.lines[currentLine].parts.length, 3);
        assert.deepEqual(concatLineParts(block.lines[currentLine]), 'function longerfunc() { "hi there"}');
    });
});