import { MessageType, Origin, ProviderMessage } from './types';

export const validateContentMessageDispatch = (data: ProviderMessage) => {
    return (
        /^(\d+)\.\d+$/.test(data.id) &&
        data.origin === Origin.PROVIDER &&
        Object.values(MessageType).includes(data.messageType)
    );
};
