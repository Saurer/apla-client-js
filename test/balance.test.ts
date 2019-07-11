/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import nodeClient from './fixtures/nodeClient';
import guestClient, { guestAccount } from './fixtures/guestClient';
import { APIError } from '../src/types/error';

describe('Balance endpoint', () => {
    it('Should not work insecure', async () => {
        const client = nodeClient();
        await expect(client.balance({ account: guestAccount })).rejects.toThrow(new APIError(
            'E_UNAUTHORIZED',
            'Unauthorized'
        ));
    });

    it('Should always return amount for guest key', async () => {
        const client = await guestClient();
        const balance = await client.balance({ account: guestAccount });
        expect(balance.amount).toMatch(/^\d+$/);
        expect(balance.money).toMatch(/^(\d+)|(\d+\\.\d+)$/);
    });

    it('Should error when using non-existing account', async () => {
        const client = await guestClient();
        await expect(client.balance({ account: '0000-0000-0000-0000-0000' })).rejects.toThrow(new APIError(
            'E_INVALIDWALLET',
            'Wallet 0000-0000-0000-0000-0000 is not valid'
        ));
    });
});