export enum Origin {
    PROVIDER = 'PROVIDER',
    BACKGROUND = 'BACKGROUND',
}

export enum MessageType {
    REQUEST = 'REQUEST',
}

export interface RequestArguments {
    readonly method: string;
    readonly params?: readonly unknown[] | Record<string, unknown>;
}

export interface Handler {
    resolve: (data: any) => void;
    reject: (error: Error) => void;
    subscriber?: (data: any) => void;
}

export type Handlers = Record<string, Handler>;