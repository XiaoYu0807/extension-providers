export enum Origin {
    ETH_PROVIDER = 'ETH_PROVIDER',
    PROVIDERS = 'PROVIDERS',
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

export interface ProviderMessage {
    id: string;
    messageType: MessageType;
    origin: Origin;
    request?: unknown;
}

export interface HandleResponseData {
    id: string;
    error?: string;
    response?: unknown;
}

export interface WindowResponseMessageBody extends HandleResponseData {
    origin: Origin;
}
