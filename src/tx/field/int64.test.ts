import field from './int64';
import { Int64BE } from 'int64-buffer';

describe('Int64 type', () => {
    it('Should validate compatible types', () => {
        expect(field.isCompatible(5764609860054344727)).toBeTruthy();
        expect(field.isCompatible(-1)).toBeTruthy();
        expect(field.isCompatible('481516')).toBeTruthy();
        expect(field.isCompatible('512')).toBeTruthy();
        expect(field.isCompatible(new Int64BE('481516'))).toBeTruthy();
        expect(field.isCompatible(new Int64BE('512'))).toBeTruthy();
    });

    it('Should invalidate bad values', () => {
        expect(field.isCompatible('TEST')).toBeFalsy();
        expect(field.isCompatible('a014')).toBeFalsy();
    });

    it('Should correctly stringify values', () => {
        expect(field.stringify(new Int64BE('5764609860054344727'))).toBe(
            '5764609860054344727'
        );
        expect(field.stringify(new Int64BE(523432))).toBe('523432');
    });

    it('Should parse values correctly', () => {
        expect(field(0.14)).toEqual(new Int64BE('0.14'));
        expect(field(256)).toEqual(new Int64BE('256'));
        expect(field('48.1516')).toEqual(new Int64BE('48.1516'));
        expect(field('512')).toEqual(new Int64BE(512));
        expect(field(new Int64BE('5764609860054344727'))).toEqual(
            new Int64BE('5764609860054344727')
        );
    });
});
