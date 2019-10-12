import endpoint from './getEcosystemParam';

describe('GetEcosystemParam', () => {
    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize({ name: 'QA_TEST_NAME' }).getResponse(
                {
                    list: [
                        {
                            id: 'QA_TEST_ID',
                            name: 'QA_TEST_NAME',
                            value: 'QA_TEST_VALUE',
                            conditions: 'QA_TEST_CONDITIONS'
                        }
                    ]
                },
                ''
            )
        ).toMatchObject({
            id: 'QA_TEST_ID',
            name: 'QA_TEST_NAME',
            value: 'QA_TEST_VALUE',
            conditions: 'QA_TEST_CONDITIONS'
        });

        expect(
            endpoint.serialize({ name: 'QA_TEST_NAME' }).getResponse(
                {
                    list: []
                },
                ''
            )
        ).toBe(undefined);
    });

    it('Must correctly pass all expected params', () => {
        expect(endpoint.serialize({ name: 'QA_TEST_NAME' }).body).toMatchObject(
            {
                names: 'QA_TEST_NAME'
            }
        );
    });
});
