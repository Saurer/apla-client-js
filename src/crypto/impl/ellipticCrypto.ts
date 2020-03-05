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

import { toHex } from '../../convert';
import { ec as EC } from 'elliptic';
import hash from 'hash.js';
import CryptoProvider from '../cryptoProvider';

const alg = new EC('p256');

export default class EllipticCrypto extends CryptoProvider {
    SHA256 = async (data: ArrayBuffer) => {
        const digest = hash
            .sha256()
            .update(data)
            .digest();

        return new Uint8Array(digest);
    };

    SHA512 = async (data: ArrayBuffer) => {
        const digest = hash
            .sha512()
            .update(data)
            .digest();

        return new Uint8Array(digest);
    };

    generatePublicKey = async (privateKey: string) => {
        const keys = alg.keyFromPrivate(privateKey);
        return keys.getPublic('hex');
    };

    generateKeyPair = async () => {
        const keyPair = alg.genKeyPair();
        const privateKey = keyPair.getPrivate('hex');
        const publicKey = keyPair.getPublic('hex');

        return {
            privateKey,
            publicKey
        };
    };

    sign = async (data: ArrayBuffer, key: string) => {
        const arr = new Uint8Array(data);
        const keys = alg.keyFromPrivate(key);
        const signature: number[] = alg.sign(arr, keys, 'raw').toDER();
        return new Uint8Array(signature);
    };

    verify = async (signature: ArrayBuffer, data: ArrayBuffer, key: string) => {
        const msgArr = new Uint8Array(data);
        const sigHex = toHex(signature);
        const keys = alg.keyFromPublic(key, 'hex');
        return keys.verify(msgArr, sigHex);
    };
}
