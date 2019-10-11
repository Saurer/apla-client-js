import endpoint from './getInterface';
import urlTemplate from 'url-template';
import { EndpointResponseType } from '..';

describe('GetInterface', () => {
    it('Must provide required url slug', () => {
        const template = urlTemplate.parse(endpoint.route);
        expect(
            template.expand(
                endpoint.serialize({
                    name: 'QA_TEST_NAME',
                    type: 'page'
                }).slug
            )
        ).toBe('interface/page/QA_TEST_NAME');
    });

    it('Must correctly transform response', () => {
        expect(
            endpoint
                .serialize({
                    name: 'QA_TEST_NAME',
                    type: 'page'
                })
                .getResponse(
                    {
                        id: 'QA_TEST_ID',
                        name: 'QA_TEST_NAME',
                        value: 'QA_TEST_VALUE',
                        conditions: 'QA_TEST_CONDITIONS'
                    },
                    ''
                )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>({
            id: 'QA_TEST_ID',
            name: 'QA_TEST_NAME',
            value: 'QA_TEST_VALUE',
            conditions: 'QA_TEST_CONDITIONS'
        });

        expect(
            endpoint
                .serialize({
                    name: 'QA_TEST_NAME',
                    type: 'page'
                })
                .getResponse(
                    {
                        id: 'QA_TEST_ID',
                        name: 'QA_TEST_NAME',
                        value: 'QA_TEST_VALUE',
                        menu: 'QA_TEST_MENU',
                        conditions: 'QA_TEST_CONDITIONS'
                    },
                    ''
                )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>({
            id: 'QA_TEST_ID',
            name: 'QA_TEST_NAME',
            value: 'QA_TEST_VALUE',
            menu: 'QA_TEST_MENU',
            conditions: 'QA_TEST_CONDITIONS'
        });
    });
});
