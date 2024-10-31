import SafeEventEmitter from '@metamask/safe-event-emitter';
import { Handlers, MessageType, Origin, RequestArguments } from './utils/types';
import { ethErrors } from 'eth-rpc-errors';

export default class EthereumProvider extends SafeEventEmitter {
    public isEthereumWallet = true;
    public isMetaMask = false;

    private _requestId = 0;
    private _handlers: Handlers = {};

    constructor() {
        super();
    }

    public async request(args: RequestArguments): Promise<unknown> {
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
    }

    private _postMessage(
        messageType: MessageType,
        request?: RequestArguments,
    ): Promise<any> {
        return new Promise((resolve, reject): void => {
            const id = `${Date.now()}.${++this._requestId}`;

            // 将该请求消息回调存储起来
            this._handlers[id] = {
                resolve,
                reject,
            };

            const message = JSON.parse(
                JSON.stringify({
                    id,
                    messageType,
                    request,
                    origin: Origin.PROVIDER,
                }),
            );

            try {
                postMessage(message, location.href);
            } catch (error) {
                throw error;
            }
        });
    }
}
