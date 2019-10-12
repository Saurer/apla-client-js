import endpoint from './version';

describe('Version', () => {
    it('Must correctly transform response', () => {
        expect(endpoint.serialize().getResponse('QA_TEST_VERSION', '')).toBe(
            'QA_TEST_VERSION'
        );
    });
});
