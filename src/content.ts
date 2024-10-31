import browser, { Runtime } from 'webextension-polyfill';

//@ts-ignore
import provider from '../dist/provider.js?raw';
import { validateContentMessageDispatch } from './utils/validate';
import { Origin } from './utils/types';

let port: Runtime.Port | undefined;

function injectEthereumProvider() {
    const injectableScript = provider;

    const injectableScriptSourceMapURL = `//# sourceURL=${browser.runtime.getURL('provider.js')}\n`;

    const BUNDLE = injectableScript + injectableScriptSourceMapURL;

    const container = document.head || document.documentElement;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.textContent = BUNDLE;
    script.setAttribute('async', 'false');

    container.insertBefore(script, container.children[0]);

    container.removeChild(script);
}

injectEthereumProvider();

function init() {
    port = browser.runtime.connect({ name: Origin.PROVIDER });

    port.onMessage.addListener((message: any): void => {
        const newMessage = {
            ...(message && typeof message !== undefined
                ? JSON.parse(JSON.stringify(message))
                : message),
            origin: Origin.BACKGROUND,
        };

        try {
            postMessage(newMessage, location.href);
        } catch (error) {
            throw error;
        }
    });
}

init();

window.addEventListener('message', (message) => {
    const { data } = message;
    console.log('content:message', data);

    if (!validateContentMessageDispatch(data)) return;

    console.log('content:message', data);

    if (port) {
        const newMessage =
            data && typeof data !== undefined
                ? JSON.parse(JSON.stringify(data))
                : data;

        port.postMessage(newMessage);
    }
});
