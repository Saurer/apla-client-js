/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import nodeClient from './fixtures/nodeClient';
import { guestKeyPublic, guestKey } from './fixtures/guestClient';
import crypto from '../src/crypto/nodeCrypto';

const apiHost = 'http://127.0.0.1:7079';

describe('AuthStatus endpoint', () => {
    it('Must return falsy value if not logged in', async () => {
        const client = nodeClient(apiHost);
        const status = await client.authStatus();
        expect(status).toEqual({
            active: false,
            expiry: 0
        })
    });

    it('Must return falsy value when using malformed token', async () => {
        const client = nodeClient(apiHost).authorize('FALSY_TOKEN');
        const status = await client.authStatus();
        expect(status).toEqual({
            active: false,
            expiry: 0
        });
    });

    it('Must return truthy expiry value when logging in', async () => {
        const expiry = 123456;
        const client = nodeClient(apiHost);
        const uid = await client.getUid();
        const tempClient = client.authorize(uid.token);
        const signature = await crypto.sign(uid.uid as any, guestKey);
        const login = await tempClient.login({
            publicKey: guestKeyPublic,
            signature,
            expiry
        });
        const securedClient = client.authorize(login.token);
        const status = await securedClient.authStatus();
        expect(status).toHaveProperty('active', true);
        expect(status.expiry).toBeCloseTo(login.timestamp + expiry);
    });
});