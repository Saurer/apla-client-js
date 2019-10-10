import SubtleCrypto from './impl/SubtleCrypto';
import ellipticCrypto from './impl/ellipticCrypto';

export interface KeyPair {
    privateKey: string;
    publicKey: string;
}

export interface CryptoProvider {
    SHA256: (data: ArrayBuffer) => Promise<ArrayBuffer>;
    SHA512: (data: ArrayBuffer) => Promise<ArrayBuffer>;
    generatePublicKey: (privateKey: string) => Promise<string>;
    generateKeyPair: () => Promise<KeyPair>;
    sign: (data: ArrayBuffer, key: string) => Promise<ArrayBuffer>;
    verify: (
        signature: ArrayBuffer,
        data: ArrayBuffer,
        key: string
    ) => Promise<boolean>;
}

const isBrowser = 'undefined' !== typeof window;
const isWebCrypto =
    isBrowser &&
    'undefined' !== typeof window.crypto &&
    'undefined' !== typeof window.crypto.subtle;
const OpenSSLCrypto = isBrowser ? undefined : require('node-webcrypto-ossl');

export default isBrowser
    ? isWebCrypto
        ? // Use window.crypto if exists
          new SubtleCrypto(window.crypto.subtle)
        : // Fallback to elliptic(slow)
          ellipticCrypto
    : // Use OpenSSL for node env
      new SubtleCrypto(new OpenSSLCrypto().subtle);
