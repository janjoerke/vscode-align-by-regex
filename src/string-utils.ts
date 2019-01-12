export function trimStart(value: string) : string {
    return value.replace(/\s+([^\s].*)/, '$1');
}

export function trimStartButOne(value: string): string {
    return value.replace(/\s+([^\s].*)/, ' $1');
}

export function trimEnd(value: string): string {
    return value.replace(/(.*[^\s])\s+$/, '$1');
}

export function trimEndButOne(value: string): string {
    return value.replace(/(.*[^\s])\s+/, '$1 ');
}

export function trimButOne(value: string): string {
    let result: string = value;
    result = trimStartButOne(result);
    result = trimEndButOne(result);
    return result;
}

export function extendToLength(value: string, length: number): string {
    return value + ' '.repeat(Math.max(0, length - value.length));
}