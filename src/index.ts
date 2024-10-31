import EthereumProvider from './Ethereum-Provider';
import { Origin, WindowResponseMessageBody } from './utils/types';

const ethereumProvider = new Proxy(new EthereumProvider(), {
    defineProperty: () => true,
});

(window as any).ethereum = ethereumProvider;

window.addEventListener(
    'message',
    (body: MessageEvent<WindowResponseMessageBody>) => {
        const { data } = body;

        if (body.data.origin !== Origin.BACKGROUND || !ethereumProvider) return;

        console.log('window:message:body', body);

        ethereumProvider.handleResponse(data);
    },
);
