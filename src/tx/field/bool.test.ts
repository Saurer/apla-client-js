import field from './bool';

describe('Bool type', () => {
    it('Should validate compatible types', () => {
        expect(field.isCompatible(true)).toBeTruthy();
        expect(field.isCompatible(false)).toBeTruthy();
        expect(field.isCompatible('true')).toBeTruthy();
        expect(field.isCompatible('false')).toBeTruthy();
    });

    it('Should invalidate bad values', () => {
        expect(field.isCompatible('TRUE')).toBeFalsy();
        expect(field.isCompatible('FALSE')).toBeFalsy();
        expect(field.isCompatible(null as any)).toBeFalsy();
        expect(field.isCompatible(undefined as any)).toBeFalsy();
    });

    it('Should correctly stringify values', () => {
        expect(field.stringify(true)).toBe('true');
        expect(field.stringify(false)).toBe('false');
    });

    it('Should parse values correctly', () => {
        expect(field('true')).toBe(true);
        expect(field('false')).toBe(false);
        expect(field(true)).toBe(true);
        expect(field(false)).toBe(false);
    });
});
