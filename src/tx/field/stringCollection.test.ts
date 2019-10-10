import field from './stringCollection';

describe('StringCollection type', () => {
    it('Should validate compatible types', () => {
        expect(field.isCompatible([])).toBeTruthy();
        expect(field.isCompatible('test')).toBeTruthy();
        expect(field.isCompatible(['false'])).toBeTruthy();
    });

    it('Should invalidate bad values', () => {
        expect(field.isCompatible(['test', 123] as any)).toBeFalsy();
    });

    it('Should correctly stringify values', () => {
        expect(field.stringify(['first'])).toBe('[first]');
        expect(field.stringify(['first', 'second'])).toBe('[first,second]');
    });

    it('Should parse values correctly', () => {
        expect(field([])).toEqual([]);
        expect(field(['test'])).toEqual(['test']);
        expect(field(['first', 'second'])).toEqual(['first', 'second']);
        expect(field('test')).toEqual(['test']);
    });
});
