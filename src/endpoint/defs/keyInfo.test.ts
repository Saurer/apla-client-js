import endpoint from './keyInfo';
import urlTemplate from 'url-template';
import { EndpointResponseType } from '..';

describe('KeyInfo', () => {
    it('Must provide required url slug', () => {
        const template = urlTemplate.parse(endpoint.route);
        expect(
            template.expand(endpoint.serialize({ id: 'QA_TEST_ID' }).slug)
        ).toBe('keyinfo/QA_TEST_ID');
    });

    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize({ id: 'QA_TEST_ID' }).getResponse(
                [
                    {
                        name: 'QA_TEST_NAME',
                        ecosystem: 'QA_TEST_ECOSYSTEM'
                    }
                ],
                ''
            )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>([
            {
                name: 'QA_TEST_NAME',
                ecosystemID: 'QA_TEST_ECOSYSTEM',
                roles: []
            }
        ]);

        expect(
            endpoint.serialize({ id: 'QA_TEST_ID' }).getResponse(
                [
                    {
                        name: 'QA_TEST_NAME',
                        ecosystem: 'QA_TEST_ECOSYSTEM',
                        roles: [
                            {
                                id: 'QA_TEST_ID',
                                name: 'QA_TEST_ROLE'
                            }
                        ]
                    }
                ],
                ''
            )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>([
            {
                name: 'QA_TEST_NAME',
                ecosystemID: 'QA_TEST_ECOSYSTEM',
                roles: [
                    {
                        id: 'QA_TEST_ID',
                        name: 'QA_TEST_ROLE'
                    }
                ]
            }
        ]);
    });
});
