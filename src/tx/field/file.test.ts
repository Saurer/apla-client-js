import field from './file';

describe('File type', () => {
    it('Should validate compatible types', () => {
        expect(
            field.isCompatible({ name: '', type: '', value: new Uint8Array() })
        ).toBeTruthy();
    });

    it('Should invalidate bad values', () => {
        expect(field.isCompatible({} as any)).toBeFalsy();
        expect(field.isCompatible(null as any)).toBeFalsy();
        expect(field.isCompatible(undefined as any)).toBeFalsy();
    });

    it('Should correctly stringify values', () => {
        expect(
            field.stringify({ Name: '', MimeType: '', Body: new Uint8Array() })
        ).toBe('[BLOB]');
    });

    it('Should parse values correctly', () => {
        expect(
            field({
                name: 'QA_TEST_NAME',
                type: 'QA_TEST_TYPE',
                value: new Uint8Array([4, 8, 15, 16, 23, 42])
            })
        ).toEqual({
            Name: 'QA_TEST_NAME',
            MimeType: 'QA_TEST_TYPE',
            Body: new Uint8Array([4, 8, 15, 16, 23, 42])
        });
    });
});
