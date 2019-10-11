import endpoint from './getHistory';
import urlTemplate from 'url-template';

describe('GetHistory', () => {
    it('Must provide required url slug', () => {
        const template = urlTemplate.parse(endpoint.route);
        expect(
            template.expand(
                endpoint.serialize({
                    id: 'QA_TEST_ID',
                    table: 'QA_TEST_TABLE'
                }).slug
            )
        ).toBe('history/QA_TEST_TABLE/QA_TEST_ID');
    });

    it('Must correctly transform response', () => {
        expect(
            endpoint
                .serialize({
                    id: 'QA_TEST_ID',
                    table: 'QA_TEST_TABLE'
                })
                .getResponse(
                    {
                        list: [
                            {
                                first: 'hello',
                                second: 'world'
                            },
                            {
                                first: 'world',
                                second: 'hello'
                            }
                        ]
                    },
                    ''
                )
        ).toMatchObject([
            {
                first: 'hello',
                second: 'world'
            },
            {
                first: 'world',
                second: 'hello'
            }
        ]);
    });
});
