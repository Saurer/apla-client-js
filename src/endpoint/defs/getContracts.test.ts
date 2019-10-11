import endpoint from './getContracts';
import { EndpointResponseType } from '..';

const testPayload = {
    offset: 15,
    limit: 50
};

describe('GetContracts', () => {
    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize(testPayload).getResponse(
                {
                    count: '15',
                    list: [
                        {
                            id: 'QA_TEST_ID',
                            name: 'QA_TEST_NAME',
                            value: 'QA_TEST_VALUE',
                            key_id: 'QA_TEST_KEY',
                            address: 'QA_TEST_ADDRESS',
                            token_id: 'QA_TEST_TOKEN',
                            conditions: 'true',
                            active: '1'
                        }
                    ]
                },
                ''
            )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>({
            count: '15',
            data: [
                {
                    id: 'QA_TEST_ID',
                    name: 'QA_TEST_NAME',
                    value: 'QA_TEST_VALUE',
                    keyID: 'QA_TEST_KEY',
                    address: 'QA_TEST_ADDRESS',
                    tokenID: 'QA_TEST_TOKEN',
                    conditions: 'true',
                    bound: true
                }
            ]
        });
    });

    it('Must correctly pass all expected params', () => {
        expect(endpoint.serialize(testPayload).body).toMatchObject(testPayload);
    });
});
