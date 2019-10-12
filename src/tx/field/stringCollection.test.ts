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
