export enum Origin {
    PROVIDER = 'PROVIDER',
    BACKGROUND = 'BACKGROUND',
}

export interface RequestArguments {
    readonly method: string;
    readonly params?: readonly unknown[] | Record<string, unknown>;
}
