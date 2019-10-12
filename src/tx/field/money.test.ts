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
