/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import nodeClient from './fixtures/nodeClient';
import 'jest-to-match-shape-of';

describe('GetBlocks endpoint', () => {
    it('Should always receive the first block', async () => {
        const client = nodeClient();
        const blocks = await client.getBlocks({ id: '1', count: 1 });
        const firstBlock = blocks['1'];
        const genesisTx = firstBlock[0];

        expect(genesisTx).toHaveProperty('contract_name', '');
        expect(genesisTx).toHaveProperty('params', null);
        expect(genesisTx).toMatchShapeOf({
            hash: '',
            contract_name: '',
        });
    });

    it('Should never fall out of bounds', async () => {
        const count = 5;
        const client = nodeClient();
        const blocks = await client.getBlocks({ id: '1', count });
        expect(Object.keys(blocks).length).toBeLessThanOrEqual(count);
    });
});