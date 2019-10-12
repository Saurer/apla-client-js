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
