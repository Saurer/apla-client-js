import endpoint from './contentHash';
import urlTemplate from 'url-template';

const testPayload = {
    name: 'QA_TEST_NAME',
    ecosystemID: 'QA_TEST_ECOSYSTEM',
    keyID: 'QA_TEST_KEY',
    roleID: 'QA_TEST_ROLE',
    locale: 'QA_TEST_LOCALE',
    params: {
        qaTestParam: 'QA_TEST_VALUE'
    }
};

describe('ContentHash', () => {
    it('Must provide required url slug', () => {
        const template = urlTemplate.parse(endpoint.route);
        expect(template.expand(endpoint.serialize(testPayload).slug)).toBe(
            'content/hash/QA_TEST_NAME'
        );
    });

    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize(testPayload).getResponse(
                {
                    hash: 'QA_TEST_PLAIN_STRING'
                },
                ''
            )
        ).toBe('QA_TEST_PLAIN_STRING');
    });

    it('Must correctly pass all expected params', () => {
        expect(endpoint.serialize(testPayload).body).toMatchObject({
            qaTestParam: 'QA_TEST_VALUE',
            lang: 'QA_TEST_LOCALE',
            ecosystem: 'QA_TEST_ECOSYSTEM',
            keyID: 'QA_TEST_KEY',
            roleID: 'QA_TEST_ROLE'
        });
    });
});
