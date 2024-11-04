import EthereumProvider from './Ethereum-Provider';
import {
    Origin,
    WindowResponseMessageBody,
    EIP6963ProviderInfo,
} from './utils/types';

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

// https://eips.ethereum.org/EIPS/eip-6963
function announceProvider() {
    const info: EIP6963ProviderInfo = {
        uuid: '350670db-19fa-4704-a166-e52e178b59d2',
        name: 'Example Wallet',
        icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>",
        rdns: 'com.example.wallet',
    };

    window.dispatchEvent(
        new CustomEvent('eip6963:announceProvider', {
            detail: Object.freeze({ info, provider: ethereumProvider }),
        }),
    );
}

window.addEventListener('eip6963:requestProvider', () => {
    announceProvider();
});

announceProvider();
