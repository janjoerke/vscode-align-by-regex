export enum PartType {
    Regex,
    Text,
}

export interface Part {
    type: PartType;
    value: string;
}