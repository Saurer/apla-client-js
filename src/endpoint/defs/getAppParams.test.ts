import endpoint from './getAppParams';
import urlTemplate from 'url-template';
import { EndpointResponseType } from '..';

const testPayload = {
    id: 'QA_TEST_ID',
    ecosystemID: 'QA_TEST_ECOSYSTEM'
};

describe('GetAppParams', () => {
    it('Must provide required url slug', () => {
        const template = urlTemplate.parse(endpoint.route);
        expect(template.expand(endpoint.serialize(testPayload).slug)).toBe(
            'appparams/QA_TEST_ID'
        );
    });

    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize(testPayload).getResponse(
                {
                    list: [
                        {
                            name: 'QA_TEST_NAME',
                            value: 'QA_TEST_VALUE',
                            conditions: 'QA_TEST_CONDITIONS'
                        }
                    ]
                },
                ''
            )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>([
            {
                name: 'QA_TEST_NAME',
                value: 'QA_TEST_VALUE',
                conditions: 'QA_TEST_CONDITIONS'
            }
        ]);
    });

    it('Must correctly pass all expected params', () => {
        expect(
            endpoint.serialize({
                ...testPayload,
                names: ['first', 'second', 'third']
            }).body
        ).toMatchObject({
            ecosystem: 'QA_TEST_ECOSYSTEM',
            names: ['first', 'second', 'third']
        });
    });
});
