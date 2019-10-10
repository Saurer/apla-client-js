import field from './string';

describe('String type', () => {
    it('Should validate compatible types', () => {
        expect(field.isCompatible('test')).toBeTruthy();
        expect(field.isCompatible('a')).toBeTruthy();
        expect(field.isCompatible('12345')).toBeTruthy();
    });

    it('Should invalidate bad values', () => {
        expect(field.isCompatible('')).toBeFalsy();
    });

    it('Should correctly stringify values', () => {
        expect(field.stringify('test')).toBe('test');
        expect(field.stringify('12345')).toBe('12345');
    });

    it('Should parse values correctly', () => {
        expect(field('test')).toBe('test');
        expect(field('12345')).toBe('12345');
    });
});
