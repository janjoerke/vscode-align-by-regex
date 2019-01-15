export function trimStart(value: string) : string {
    return value.replace(/^\s+([^\s].*)/, '$1');
}

export function trimStartButOne(value: string): string {
    return value.replace(/^\s+([^\s].*)/, ' $1');
}

export function trimEnd(value: string): string {
    return value.replace(/(.*[^\s])\s+$/, '$1');
}

export function trimEndButOne(value: string): string {
    return value.replace(/(.*[^\s])\s+$/, '$1 ');
}

export function trimButOne(value: string): string {
    let result: string = value;
    result = trimStartButOne(result);
    result = trimEndButOne(result);
    return result;
}

export function extendToLength(value: string, length: number, tabSize : number): string {
    return value + ' '.repeat(Math.max(0, length - tabAwareLength(value, tabSize)));
}

export function tabAwareLength(value: string, tabSize: number) : number {
    var length = 0;
    for (let idx = 0; idx < value.length; ++idx) {
        length += value.charAt(idx) === "\t" ? tabSize : 1;
    }

    return length;
}

export function checkedRegex(input: string) : RegExp | undefined {
    try {
        return new RegExp(input, 'g');
    } catch(e) {
        return undefined;
    }
}