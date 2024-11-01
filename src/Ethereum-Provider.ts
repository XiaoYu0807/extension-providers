import SafeEventEmitter from '@metamask/safe-event-emitter';
import {
    HandleResponseData,
    Handlers,
    MessageType,
    Origin,
    ProviderMessage,
    RequestArguments,
} from './utils/types';
import { ethErrors } from 'eth-rpc-errors';

export default class EthereumProvider extends SafeEventEmitter {
    public isWallet = true;
    public isMetaMask = false;

    private _requestId = 0;
    private _handlers: Handlers = {};

    constructor() {
        super();
    }

    public request = (args: RequestArguments): Promise<unknown> => {
        const { method, params } = args;

        if (typeof method !== 'string' || method.length === 0) {
            throw ethErrors.rpc.invalidRequest({
                message: '`method` property must be a non-empty string.',
                data: args,
            });
        }

        if (
            params !== undefined &&
            !Array.isArray(params) &&
            (typeof params !== 'object' || params === null)
        ) {
            throw ethErrors.rpc.invalidRequest({
                message:
                    '`params` property must be an object or array if provided.',
                data: args,
            });
        }

        return this._postMessage(MessageType.REQUEST, args);
    };

    public handleResponse = (data: HandleResponseData) => {
        const handler = this._handlers[data.id];

        if (!handler) return;

        if (data.error) {
            const parsedError = JSON.parse(data.error);
            const err = new Error(parsedError.message);

            handler.reject(err);
        } else {
            handler.resolve(data.response);
        }
    };

    private _postMessage = (
        messageType: MessageType,
        request?: RequestArguments,
    ): Promise<any> => {
        return new Promise((resolve, reject): void => {
            const message = this._getMessage(messageType, request);

            // 将该请求消息回调存储起来 方便回调返回
            this._handlers[message.id] = {
                resolve,
                reject,
            };

            try {
                postMessage(message, location.href);
            } catch (error) {
                throw error;
            }
        });
    };

    private _getMessage = (
        messageType: MessageType,
        request?: RequestArguments,
    ): ProviderMessage => {
        const id = `${Date.now()}.${++this._requestId}`;

        const message = {
            id,
            messageType,
            request,
            origin: Origin.ETH_PROVIDER,
        };

        return JSON.parse(JSON.stringify(message));
    };
}
