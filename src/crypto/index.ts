// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

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
