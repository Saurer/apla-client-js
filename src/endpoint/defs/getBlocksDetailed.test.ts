import endpoint from './getBlocksDetailed';

describe('GetBlocksDetailed', () => {
    it('Must correctly pass all expected params', () => {
        expect(
            endpoint.serialize({
                id: 'QA_TEST_ID',
                count: 32
            }).body
        ).toMatchObject({
            block_id: 'QA_TEST_ID',
            count: 32
        });
    });
});
