import field from './money';

describe('Money type', () => {
    it('Should validate compatible types', () => {
        expect(field.isCompatible('0.14')).toBeTruthy();
        expect(field.isCompatible('256')).toBeTruthy();
        expect(field.isCompatible('48.1516')).toBeTruthy();
        expect(field.isCompatible('512')).toBeTruthy();
    });

    it('Should invalidate bad values', () => {
        expect(field.isCompatible('TEST')).toBeFalsy();
        expect(field.isCompatible('a014')).toBeFalsy();
    });

    it('Should correctly stringify values', () => {
        expect(field.stringify('0.14')).toBe('0.14');
        expect(field.stringify('523432')).toBe('523432');
    });

    it('Should parse values correctly', () => {
        expect(field('0.000000000000000256')).toBe('256');
        expect(field('128.000000000000000256')).toBe('128000000000000000256');
        expect(field('00000000.000000000000000064')).toBe('64');
        expect(field('test')).toBe('');
    });
});
