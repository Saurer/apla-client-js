import endpoint from './contentMenu';
import urlTemplate from 'url-template';
import { EndpointResponseType } from '..';

const testPayload = {
    locale: 'QA_TEST_LOCALE',
    name: 'QA_TEST_NAME',
    params: {
        qaTestParam: 'QA_TEST_VALUE'
    }
};

describe('ContentMenu', () => {
    it('Must provide required url slug', () => {
        const template = urlTemplate.parse(endpoint.route);
        expect(template.expand(endpoint.serialize(testPayload).slug)).toBe(
            'content/menu/QA_TEST_NAME'
        );
    });

    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize(testPayload).getResponse(
                {
                    tree: [
                        {
                            tag: 'QA_TEST_TAG',
                            text: 'QA_TEST_TEXT',
                            attr: {
                                qaTestAttr: 'QA_TEST_VALUE'
                            },
                            children: null
                        }
                    ],
                    title: 'QA_TEST_TITLE'
                },
                ''
            )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>({
            tree: [
                {
                    tag: 'QA_TEST_TAG',
                    text: 'QA_TEST_TEXT',
                    attr: {
                        qaTestAttr: 'QA_TEST_VALUE'
                    },
                    children: null
                }
            ],
            title: 'QA_TEST_TITLE'
        });
    });

    it('Must correctly pass all expected params', () => {
        expect(endpoint.serialize(testPayload).body).toMatchObject({
            qaTestParam: 'QA_TEST_VALUE',
            lang: 'QA_TEST_LOCALE'
        });
    });
});
