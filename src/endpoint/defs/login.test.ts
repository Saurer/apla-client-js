import endpoint from './login';
import { EndpointResponseType } from '..';

const testPayload = {
    ecosystemID: 'QA_TEST_ECOSYSTEM',
    publicKey: 'QA_TEST_PUBLICKEY',
    signature: 'QA_TEST_SIGNATURE',
    roleID: 'QA_TEST_ROLE',
    expiry: 4096,
    isMobile: true
};

describe('Login', () => {
    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize(testPayload).getResponse(
                {
                    token: 'QA_TEST_TOKEN',
                    ecosystem_id: 'QA_TEST_ECOSYSTEM',
                    key_id: 'QA_TEST_KEY',
                    account: 'QA_TEST_ACCOUNT',
                    notify_key: 'QA_TEST_WEBSOCKET',
                    isnode: 'false',
                    isowner: 'true',
                    timestamp: '4815162342'
                },
                ''
            )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>({
            token: 'QA_TEST_TOKEN',
            ecosystemID: 'QA_TEST_ECOSYSTEM',
            keyID: 'QA_TEST_KEY',
            account: 'QA_TEST_ACCOUNT',
            websocketToken: 'QA_TEST_WEBSOCKET',
            isNode: false,
            isOwner: true,
            timestamp: 4815162342
        });
    });

    it('Must correctly pass all expected params', () => {
        expect(endpoint.serialize(testPayload).body).toMatchObject({
            ecosystem: 'QA_TEST_ECOSYSTEM',
            expire: 4096,
            pubkey: 'QA_TEST_PUBLICKEY',
            signature: 'QA_TEST_SIGNATURE',
            role_id: 'QA_TEST_ROLE',
            mobile: true
        });
    });
});
