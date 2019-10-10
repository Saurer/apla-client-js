/*---------------------------------------------------------------------------------------------
 *  Copyright (c) EGAAS S.A. All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Uint64BE } from 'int64-buffer';

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
    if ('undefined' === typeof window || !window.TextEncoder) {
        const util = await import('util');
        const encoder = new util.TextEncoder();
        return encoder.encode(data);
    } else {
        const encoder = new TextEncoder();
        return encoder.encode(data);
    }
};

export const concatBuffer = (a: Uint8Array, b: Uint8Array) => {
    const uint8 = new Uint8Array(a.length + b.length);

    uint8.set(a, 0);
    uint8.set(b, a.length);

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
