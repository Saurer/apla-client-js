import endpoint from './getRows';
import urlTemplate from 'url-template';

const testPayload = {
    offset: '16',
    limit: '32',
    table: 'QA_TABLE'
};

describe('GetRows', () => {
    it('Must provide required url slug', () => {
        const template = urlTemplate.parse(endpoint.route);
        expect(template.expand(endpoint.serialize(testPayload).slug)).toBe(
            'list/QA_TABLE'
        );
    });

    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize(testPayload).getResponse(
                {
                    count: '1',
                    list: [
                        {
                            id: 'QA_TEST_ID',
                            qaFirst: 'QA_FIRST',
                            qaSecond: 'QA_SECOND'
                        }
                    ]
                },
                ''
            )
        ).toMatchObject({
            count: '1',
            data: [
                {
                    id: 'QA_TEST_ID',
                    qaFirst: 'QA_FIRST',
                    qaSecond: 'QA_SECOND'
                }
            ]
        });
    });

    it('Must correctly pass all expected params', () => {
        expect(
            endpoint.serialize({ ...testPayload, columns: ['first', 'second'] })
                .body
        ).toMatchObject({
            offset: '16',
            limit: '32',
            columns: ['first', 'second']
        });

        expect(endpoint.serialize(testPayload).body).toMatchObject({
            offset: '16',
            limit: '32',
            columns: []
        });
    });
});
