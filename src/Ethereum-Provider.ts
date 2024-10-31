import SafeEventEmitter from '@metamask/safe-event-emitter';
import { RequestArguments } from './utils/types';
import { ethErrors } from 'eth-rpc-errors';

export default class EthereumProvider extends SafeEventEmitter {
    isEthereumWallet = true;

    isMetaMask = false;

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

        return Promise.resolve('send message');
    }
}
