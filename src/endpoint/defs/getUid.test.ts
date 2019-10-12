import endpoint from './getUid';
import { EndpointResponseType } from '..';

describe('GetTables', () => {
    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize().getResponse(
                {
                    token: 'QA_TEST_TOKEN',
                    network_id: '128',
                    uid: 'QA_TEST_UID'
                },
                ''
            )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>({
            token: 'QA_TEST_TOKEN',
            networkID: 128,
            uid: 'LOGIN128QA_TEST_UID'
        });
    });
});
