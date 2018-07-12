export enum PartType {
    Regex,
    Text,
}

export interface Part {

    type: PartType;
    value: string;
    position: number;
    length: number;
}