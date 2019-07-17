/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import nodeCrypto from './nodeCrypto';

export interface Crypto {
    sha256: (data: ArrayBuffer) => Promise<ArrayBuffer>;
    sign: (data: ArrayBuffer, key: string) => Promise<string>;
    generatePublicKey: (privateHex: string) => Promise<string>;
};

// TODO: Check if running in browser
export default nodeCrypto;