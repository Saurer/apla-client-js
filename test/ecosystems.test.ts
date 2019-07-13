/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import guestClient from './fixtures/guestClient';
import { APIError } from '../src/types/error';

describe('Ecosystem endpoints', () => {
    it('Should always return current ecosystem name', async () => {
        const client = await guestClient();
        const ecosystemName = await client.getEcosystemName({ id: '1' });
        expect(ecosystemName).toBe('platform ecosystem');
    });

    it('Should throw with empty parameter', async () => {
        const client = await guestClient();
        await expect(client.getEcosystemName({ id: '' })).rejects.toThrow(new APIError(
            'E_PARAMNOTFOUND',
            'Parameter name has not been found'
        ));
    });
});