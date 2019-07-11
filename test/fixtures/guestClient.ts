/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import crypto from '../../src/crypto/nodeCrypto';
import nodeClient from './nodeClient';

export const guestID = '4544233900443112470';
export const guestKey = 'e5a87a96a445cb55a214edaad3661018061ef2936e63a0a93bdb76eb28251c1f';
export const guestKeyPublic = '04489347a1205c818d9a02f285faaedd0122a56138e3d985f5e1b4f6a9470f90f692a00a3453771dd7feea388ceb7aefeaf183e299c70ad1aecb7f870bfada3b86';

export default async (apiHost: string) => {
    const client = nodeClient(apiHost, {
        transport: fetch
    });

    const uid = await client.getUid();
    const tempClient = client.authorize(uid.token);
    const signature = await crypto.sign(uid.uid as any, guestKey);
    const login = await tempClient.login({
        publicKey: guestKeyPublic,
        signature
    });
    return tempClient.authorize(login.token);
};