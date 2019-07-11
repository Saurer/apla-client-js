/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import nodeClient from './fixtures/nodeClient';

describe('Version endpoint', () => {
    it('Should return truthy value', async () => {
        const client = nodeClient();
        const version = await client.version();
        expect(version).toMatch(/^\d\.\d\.\d .*$/);
    });
});