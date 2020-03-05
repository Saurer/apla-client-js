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

import { hexToUint8Array } from '../convert';
import { ec as EC } from 'elliptic';
import crc64 from './crc64';
import Long from 'long';

export interface KeyPair {
    privateKey: string;
    publicKey: string;
}

const alg = new EC('p256');

export default abstract class CryptoProvider {
    public readonly ADDRESS_LENGTH = 20;
    public readonly CURVE = {
        name: 'ECDSA',
        namedCurve: 'P-256'
    };
    public readonly SIGN_ALG = {
        name: 'ECDSA',
        hash: 'SHA-256'
    };

    public abstract SHA256: (data: ArrayBuffer) => Promise<ArrayBuffer>;
    public abstract SHA512: (data: ArrayBuffer) => Promise<ArrayBuffer>;
    public abstract generatePublicKey: (privateKey: string) => Promise<string>;
    public abstract generateKeyPair: () => Promise<KeyPair>;
    public abstract sign: (
        data: ArrayBuffer,
        key: string
    ) => Promise<ArrayBuffer>;
    public abstract verify: (
        signature: ArrayBuffer,
        data: ArrayBuffer,
        key: string
    ) => Promise<boolean>;

    public getKeyID = async (publicKey: string) => {
        const keyBytes = hexToUint8Array(publicKey.slice(2));
        const keyDigest = await this.SHA256(keyBytes);
        const hashDigest = await this.SHA512(keyDigest);
        const crc = crc64(Array.from(new Uint8Array(hashDigest)));
        const value = '0'.repeat(this.ADDRESS_LENGTH - crc.length) + crc;
        const crcDigits = value.split('').map(l => parseInt(l, 10));
        const addrChecksum = this._checksum(crcDigits.slice(0, -1));
        const crcLong = Long.fromString(crc);

        return crcLong
            .sub(this._remainder(crc, 10))
            .add(addrChecksum)
            .toString();
    };

    public getKeyAddress = (keyID: string) => {
        const num = Long.fromString(keyID, true, 10).toString();
        let val = '0'.repeat(20 - num.length) + num;
        let ret = '';

        for (let i = 0; i < 4; i++) {
            ret += val.slice(i * 4, (i + 1) * 4) + '-';
        }
        ret += val.slice(16);

        return ret;
    };

    protected getPrivateKeyPair = (keyHex: string): EC.KeyPair => {
        return alg.keyFromPrivate(keyHex, 'hex');
    };

    protected getPublicKeyPair = (keyHex: string): EC.KeyPair => {
        return alg.keyFromPublic(keyHex, 'hex');
    };

    private _remainder = (x: string, y: number) => {
        const a = parseInt(x.slice(0, x.length - 10), 10) % y;
        const b = parseInt(x.slice(10), 10) % y;
        return (a * (10 ** 10 % y) + b) % y;
    };

    private _checksum = (digits: number[]) => {
        let first = 0;
        let second = 0;
        let value = 0;

        for (let i = 0; i < digits.length; i++) {
            const digit = digits[i];
            if (i & 1) {
                first += digit;
            } else {
                second += digit;
            }
        }

        value = (second + 3 * first) % 10;

        if (0 < value) {
            value = 10 - value;
        }

        return value;
    };
}
