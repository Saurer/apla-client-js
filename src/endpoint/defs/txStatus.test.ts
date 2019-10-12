import endpoint from './txStatus';
import { EndpointResponseType } from '..';

const testPayload = {
    hashes: ['first', 'second', 'third', 'fourth']
};

describe('TxStatus', () => {
    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize(testPayload).getResponse(
                {
                    results: {
                        first: {
                            blockid: '256'
                        },
                        second: {
                            blockid: '512',
                            result: 'withResult'
                        },
                        third: {
                            errmsg: {
                                type: 'QA_TEST_TYPE',
                                error: 'QA_TEST_ERROR'
                            }
                        },
                        fourth: {
                            errmsg: {
                                id: '384',
                                type: 'QA_TEST_TYPE',
                                error: 'QA_TEST_ERROR'
                            }
                        }
                    }
                },
                ''
            )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>({
            first: {
                blockid: '256'
            },
            second: {
                blockid: '512',
                result: 'withResult'
            },
            third: {
                errmsg: {
                    type: 'QA_TEST_TYPE',
                    error: 'QA_TEST_ERROR'
                }
            },
            fourth: {
                errmsg: {
                    id: '384',
                    type: 'QA_TEST_TYPE',
                    error: 'QA_TEST_ERROR'
                }
            }
        });
    });

    it('Must correctly pass all expected params', () => {
        expect(endpoint.serialize(testPayload).body).toMatchObject({
            data: '{"hashes":["first","second","third","fourth"]}'
        });
    });
});
