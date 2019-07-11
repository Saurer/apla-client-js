/*---------------------------------------------------------------------------------------------
 *  Copyright (c) EGAAS S.A. All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Crypto } from './';
import { toHex } from '../convert';

const textEncoder = new TextEncoder();

const browserCrypto: Crypto = {
    sha256: async (data: ArrayBuffer) =>
        crypto.subtle.digest({ name: 'SHA-256' }, data),

    sign: async (data: ArrayBuffer, keyHex: string) => {
        const keyBuffer = textEncoder.encode(keyHex);
        const key = await crypto.subtle.importKey('raw', keyBuffer, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
        const signature = await crypto.subtle.sign('p256', key, data);
        return toHex(signature);
    }
};

export default browserCrypto;