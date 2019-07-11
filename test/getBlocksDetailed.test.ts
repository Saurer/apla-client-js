/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import nodeClient from './fixtures/nodeClient';

describe('GetBlocksDetailed endpoint', () => {
    it('Should always receive the first block', async () => {
        const client = nodeClient();
        const blocks = await client.getBlocksDetailed({ id: '1', count: 1 });
        const firstBlock = blocks['1'];
        const genesisTx = firstBlock.transactions[0];

        expect(firstBlock).toMatchShapeOf({
            hash: '',
            key_id: 1,
            time: 1,
            rollbacks_hash: '',
            mrkl_root: ''
        });
        expect(firstBlock.tx_count).toEqual(1);
        expect(firstBlock.stop_count).toEqual(0);

        expect(firstBlock.header).toMatchShapeOf({
            time: 1,
            key_id: 1,
            node_position: 1
        });

        expect(genesisTx).toMatchShapeOf({
            hash: ''
        });
        expect(genesisTx.contract_name).toEqual('');
        expect(genesisTx.params).toEqual(null);
        expect(genesisTx.key_id).toEqual(0);
        expect(genesisTx.time).toEqual(0);
        expect(genesisTx.type).toEqual(0);
    });

    it('Should never fall out of bounds', async () => {
        const count = 5;
        const client = nodeClient();
        const blocks = await client.getBlocksDetailed({ id: '1', count });
        expect(Object.keys(blocks).length).toBeLessThanOrEqual(count);
    });
});