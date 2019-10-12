import endpoint from './network';
import { EndpointResponseType } from '..';

describe('Network', () => {
    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize().getResponse(
                {
                    network_ud: '1024',
                    centrifugo_url: 'QA_TEST_URL',
                    test: true,
                    full_nodes: [
                        {
                            key_ud: '256',
                            public_key: 'QA_TEST_PUBLIC_KEY',
                            stopped: true,
                            tcp_address: 'QA_TEST_TCP',
                            api_address: 'QA_TEST_API'
                        }
                    ]
                },
                ''
            )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>({
            networkID: '1024',
            centrifugoUrl: 'QA_TEST_URL',
            test: true,
            fullNodes: [
                {
                    keyID: '256',
                    publicKey: 'QA_TEST_PUBLIC_KEY',
                    stopped: true,
                    tcpAddress: 'QA_TEST_TCP',
                    apiAddress: 'QA_TEST_API'
                }
            ]
        });
    });
});
