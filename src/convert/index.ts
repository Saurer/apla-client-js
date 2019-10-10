/*---------------------------------------------------------------------------------------------
 *  Copyright (c) EGAAS S.A. All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Uint64BE } from 'int64-buffer';
import Long from 'long';
import crc64 from '../crypto/crc64';
import crypto from '../crypto';

export const MONEY_POWER = 18;
export const ADDRESS_LENGTH = 20;

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

const remainder = (x: string, y: number) => {
    const a = parseInt(x.slice(0, x.length - 10), 10) % y;
    const b = parseInt(x.slice(10), 10) % y;
    return (a * (10 ** 10 % y) + b) % y;
};

export const checksum = (digits: number[]) => {
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

export const publicToID = async (publicKey: string) => {
    const keyBytes = hexToUint8Array(publicKey.slice(2));
    const keyDigest = await crypto.SHA256(keyBytes);
    const hashDigest = await crypto.SHA512(keyDigest);
    const crc = crc64(Array.from(new Uint8Array(hashDigest)));
    const value = '0'.repeat(ADDRESS_LENGTH - crc.length) + crc;
    const crcDigits = value.split('').map(l => parseInt(l, 10));
    const addrChecksum = checksum(crcDigits.slice(0, -1));
    const crcLong = Long.fromString(crc);

    return crcLong
        .sub(remainder(crc, 10))
        .add(addrChecksum)
        .toString();
};

export const toAddress = (keyID: string) => {
    const num = Long.fromString(keyID, true, 10).toString();
    let val = '0'.repeat(20 - num.length) + num;
    let ret = '';

    for (let i = 0; i < 4; i++) {
        ret += val.slice(i * 4, (i + 1) * 4) + '-';
    }
    ret += val.slice(16);

    return ret;
};
