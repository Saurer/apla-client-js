// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

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
