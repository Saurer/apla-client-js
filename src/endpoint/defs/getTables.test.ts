import endpoint from './getTables';
import { EndpointResponseType } from '..';

const testPayload = {
    offset: '128',
    limit: '256'
};

describe('GetTables', () => {
    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize(testPayload).getResponse(
                {
                    count: 8,
                    list: [
                        {
                            name: 'QA_TEST_NAME',
                            count: 'QA_TEST_COUNT'
                        }
                    ]
                },
                ''
            )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>({
            count: 8,
            data: [
                {
                    name: 'QA_TEST_NAME',
                    count: 'QA_TEST_COUNT'
                }
            ]
        });
    });

    it('Must correctly pass all expected params', () => {
        expect(endpoint.serialize(testPayload).body).toMatchObject({
            offset: '128',
            limit: '256'
        });
    });
});
