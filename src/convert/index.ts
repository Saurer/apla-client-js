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

import { Uint64BE } from 'int64-buffer';

const textEncoder = new TextEncoder();

export const MONEY_POWER = 18;

export const toHex = (buffer: ArrayBuffer): string => {
    return Array.prototype.map
        .call(new Uint8Array(buffer), (x: number) =>
            ('00' + x.toString(16)).slice(-2)
        )
        .join('')
        .toUpperCase();
};

export const toUint8Array = async (data: string) => {
    return textEncoder.encode(data);
};

export const concatBuffer = (a: ArrayBuffer, b: ArrayBuffer) => {
    const aView = new Uint8Array(a);
    const bView = new Uint8Array(b);
    const uint8 = new Uint8Array(aView.length + bView.length);

    uint8.set(aView, 0);
    uint8.set(bView, aView.length);

    return uint8;
};

export const encodeLength = (length: number): Uint8Array => {
    if (length >= 0 && length < 128) {
        const value = new Uint8Array(1);
        value[0] = length;
        return value;
    }

    const buffer = new Uint64BE(length).toArrayBuffer();
    const bufferArray = new Uint8Array(buffer);

    let i = 0;
    while (bufferArray[i] === 0 && i < bufferArray.length) {
        i++;
    }

    const offset = 128 | (bufferArray.length - i);
    const resultArray = bufferArray.slice(i - 1, bufferArray.length);
    resultArray[0] = offset;

    return resultArray;
};

export const encodeLengthPlusData = (buffer: Uint8Array): ArrayBuffer => {
    return concatBuffer(encodeLength(buffer.length), buffer);
};

export const toMoney = (value: number | string, power = MONEY_POWER) => {
    const match = /([\d]+)((\.|,)([\d]+))?/.exec(String(value));

    if (!match) {
        return null;
    }

    const integer = match[1];
    const fraction = match[4] || '';
    let result = integer;

    for (let i = 0; i < power; i++) {
        const val = fraction.length <= i ? '0' : fraction[i];
        result += val;
    }

    if (fraction.length > power) {
        result =
            result + '.' + fraction.slice(power, power * 2).replace(/0+$/, '');
    }

    result = result.replace(/^0+/, '');

    return '' === result || result.startsWith('.') ? '0' + result : result;
};

export const hexToUint8Array = (hex: string) => {
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.slice(i, i + 2), 16));
    }

    return new Uint8Array(bytes);
};
