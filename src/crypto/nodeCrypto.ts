/*---------------------------------------------------------------------------------------------
 *  Copyright (c) EGAAS S.A. All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Crypto } from './';
import { createHash, Binary } from 'crypto';
import Elliptic from 'elliptic';

const alg = new Elliptic.ec('p256');

const nodeCrypto: Crypto = {
    sha256: async (data: ArrayBuffer) =>
        Promise.resolve(createHash('sha256').update(data as Binary).digest()),

    sign: async (data: ArrayBuffer, key: string) => {
        const keys = alg.keyFromPrivate(key);
        const hash = await nodeCrypto.sha256(data);
        return keys.sign(new Uint8Array(hash)).toDER('hex');
    },

    generatePublicKey: async (privateHex: string) => {
        const keys = alg.keyFromPrivate(privateHex);
        return keys.getPublic().encode('hex', false) as string;
    }
};

export default nodeCrypto;