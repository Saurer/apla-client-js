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

import { encode, decode } from '../base64url';
import { hexToUint8Array, toHex } from '../../convert';
import CryptoProvider from '../cryptoProvider';

export default class SubtleCrypto extends CryptoProvider {
    private readonly _subtle: typeof crypto.subtle;

    constructor(provider: typeof crypto.subtle) {
        super();
        this._subtle = provider;
    }

    protected importKey = async (hex: string, type: 'sign' | 'verify') => {
        const keyPair =
            'sign' === type
                ? this.getPrivateKeyPair(hex)
                : this.getPublicKeyPair(hex);
        const publicKey = keyPair.getPublic();
        const x = ('0'.repeat(64) + publicKey.getX().toJSON()).slice(-64);
        const y = ('0'.repeat(64) + publicKey.getY().toJSON()).slice(-64);

        const params: { [key: string]: any } = {
            crv: 'P-256',
            ext: true,
            key_ops: [type],
            kty: 'EC',
            x: encode(hexToUint8Array(x)),
            y: encode(hexToUint8Array(y))
        };

        if ('sign' === type) {
            params.d = encode(hexToUint8Array(hex));
        }

        return await this._subtle.importKey('jwk', params, this.CURVE, true, [
            type
        ]);
    };

    SHA256 = async (data: ArrayBuffer) => {
        return await this._subtle.digest('SHA-256', data);
    };

    SHA512 = async (data: ArrayBuffer) => {
        return await this._subtle.digest('SHA-512', data);
    };

    generatePublicKey = async (privateKey: string) => {
        const keyPair = this.getPrivateKeyPair(privateKey);
        return keyPair.getPublic('hex');
    };

    generateKeyPair = async () => {
        const keys = await this._subtle.generateKey(this.CURVE, true, [
            'sign',
            'verify'
        ]);

        const jwkPrivate = await this._subtle.exportKey('jwk', keys.privateKey);
        const privateKey = toHex(decode(jwkPrivate.d!));
        const publicKey = await this.generatePublicKey(privateKey);

        return {
            privateKey,
            publicKey
        };
    };

    sign = async (data: ArrayBuffer, key: string) => {
        const cryptoKey = await this.importKey(key, 'sign');
        const signature = await this._subtle.sign(
            this.SIGN_ALG,
            cryptoKey,
            data
        );
        return new Uint8Array(signature);
    };

    verify = async (signature: ArrayBuffer, data: ArrayBuffer, key: string) => {
        const cryptoKey = await this.importKey(key, 'verify');
        const valid = await this._subtle.verify(
            this.SIGN_ALG,
            cryptoKey,
            signature,
            data
        );
        return valid;
    };
}
