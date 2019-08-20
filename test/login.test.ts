/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import nodeClient from './fixtures/nodeClient';
import crypto from '../src/crypto/nodeCrypto';
import { guestKey, guestKeyPublic, guestID } from './fixtures/guestClient';
import 'jest-to-match-shape-of';

describe('Basic authorization', () => {
    test('Login using guest key', async () => {
        const client = nodeClient();
        const uid = await client.getUid();
        const signature = await crypto.sign(uid.uid as any, guestKey);
        const tempClient = client.authorize(uid.token);
        const login = await tempClient.login({
            publicKey: guestKeyPublic,
            signature
        });

        expect(login).toMatchShapeOf({
            token: '',
            ecosystemID: '1',
            keyID: '1',
            account: '',
            websocketToken: '',
            isNode: true,
            isOwner: true,
            isOBS: true,
            timestamp: 1
        });

        expect(login).toMatchObject({
            ecosystemID: '1',
            keyID: guestID,
            isNode: false,
            isOwner: false,
            isOBS: false
        });
    });
});