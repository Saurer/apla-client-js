import endpoint from './getEcosystemName';

describe('GetEcosystemName', () => {
    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize({ id: 'QA_TEST_ID' }).getResponse(
                {
                    ecosystem_name: 'QA_TEST_NAME'
                },
                ''
            )
        ).toBe('QA_TEST_NAME');
    });

    it('Must correctly pass all expected params', () => {
        expect(endpoint.serialize({ id: 'QA_TEST_ID' }).body).toMatchObject({
            id: 'QA_TEST_ID'
        });
    });
});
