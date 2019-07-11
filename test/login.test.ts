/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import AplaClient from '../src';
import crypto from '../src/crypto/nodeCrypto';
import { guestKey, guestKeyPublic, guestID } from './fixtures/guestClient';
const fetch = require('node-fetch');

const apiHost = 'http://127.0.0.1:7079';

describe('Basic authorization', () => {
    test('Login using guest key', async () => {
        const client = new AplaClient(apiHost, {
            transport: fetch
        });
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