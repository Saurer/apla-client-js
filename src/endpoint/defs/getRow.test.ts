import endpoint from './getRow';
import urlTemplate from 'url-template';

const testPayload = {
    table: 'QA_TEST_TABLE',
    column: 'QA_TEST_COLUMN',
    value: 'QA_TEST_VALUE'
};

describe('GetRow', () => {
    it('Must provide required url slug', () => {
        const template = urlTemplate.parse(endpoint.route);
        expect(template.expand(endpoint.serialize(testPayload).slug)).toBe(
            'row/QA_TEST_TABLE/QA_TEST_COLUMN/QA_TEST_VALUE'
        );
    });

    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize(testPayload).getResponse(
                {
                    value: {
                        id: 'QA_TEST_ID',
                        qaFirst: 'QA_FIRST',
                        qaSecond: 'QA_SECOND'
                    }
                },
                ''
            )
        ).toMatchObject({
            id: 'QA_TEST_ID',
            qaFirst: 'QA_FIRST',
            qaSecond: 'QA_SECOND'
        });
    });

    it('Must correctly pass all expected params', () => {
        expect(
            endpoint.serialize({ ...testPayload, columns: ['first', 'second'] })
                .body
        ).toMatchObject({
            columns: ['first', 'second']
        });

        expect(endpoint.serialize(testPayload).body).toMatchObject({
            columns: []
        });
    });
});
