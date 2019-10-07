import { toHex } from '../../convert';
import { CryptoProvider } from '../';
import { ec as EC } from 'elliptic';

const alg = new EC('p256');

const ellipticCrypto: CryptoProvider = {
    generatePublicKey: async privateKey => {
        const keys = alg.keyFromPrivate(privateKey);
        return keys.getPublic('hex');
    },
    generateKeyPair: async () => {
        const keyPair = alg.genKeyPair();
        const privateKey = keyPair.getPrivate('hex');
        const publicKey = keyPair.getPublic('hex');

        return {
            privateKey,
            publicKey
        };
    },
    sign: async (data, key) => {
        const arr = new Uint8Array(data);
        const keys = alg.keyFromPrivate(key);
        const signature: number[] = alg.sign(arr, keys, 'raw').toDER();
        return new Uint8Array(signature).buffer;
    },
    verify: async (signature, data, key) => {
        const msgArr = new Uint8Array(data);
        const sigHex = toHex(signature);
        const keys = alg.keyFromPublic(key, 'hex');
        return keys.verify(msgArr, sigHex);
    }
};

export default ellipticCrypto;
