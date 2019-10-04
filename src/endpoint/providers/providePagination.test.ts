import providePagination from './providePagination';

describe('Pagination', () => {
    it('Should provide pagination if specified', () => {
        const request = { excess: 'params', offset: 10, limit: 12 };
        const params = providePagination(request);

        expect(params).toMatchObject<{ offset: number; limit: number }>({
            offset: 10,
            limit: 12
        });
    });

    it('Should provide pagination if no offset specified', () => {
        const request = { excess: 'params', limit: 12 };
        const params = providePagination(request);

        expect(params).toMatchObject<{ limit: number }>({
            limit: 12
        });
    });

    it('Should provide pagination if no limit specified', () => {
        const request = { excess: 'params', offset: 10 };
        const params = providePagination(request);

        expect(params).toMatchObject<{ offset: number }>({
            offset: 10
        });
    });

    it('Should return empty object if no valid params found', () => {
        const request = { excess: 'params' } as object;
        const params = providePagination(request);

        expect(params).toMatchObject<{}>({});
    });
});
