import endpoint from './contentTest';
import { EndpointResponseType } from '..';

const testPayload = {
    locale: 'QA_TEST_LOCALE',
    template: 'QA_TEST_TEMPLATE',
    params: {
        qaTestParam: 'QA_TEST_VALUE'
    }
};

describe('ContentTest', () => {
    it('Must provide a fallback if certain properties are missing', () => {
        expect(
            endpoint.serialize(testPayload).getResponse({}, 'QA_PLAIN_TEXT')
        ).toMatchObject<EndpointResponseType<typeof endpoint>>({
            tree: []
        });
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
                    ]
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
            ]
        });
    });

    it('Must correctly pass all expected params', () => {
        expect(endpoint.serialize(testPayload).body).toMatchObject({
            qaTestParam: 'QA_TEST_VALUE',
            template: 'QA_TEST_TEMPLATE',
            lang: 'QA_TEST_LOCALE'
        });
    });
});
