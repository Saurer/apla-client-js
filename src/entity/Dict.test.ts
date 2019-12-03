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

import Dict from './Dict';

describe('Dict', () => {
    it('Should construct from array of tuples', () => {
        const values: [string, string][] = [
            ['1', 'first'],
            ['2', 'second'],
            ['3', 'third']
        ];

        const dict = new Dict(values);
        expect(dict).toBeInstanceOf(Dict);
        expect(dict.count()).toBe(3);
        expect(dict.get('1')).toBe('first');
        expect(dict.get('2')).toBe('second');
        expect(dict.get('3')).toBe('third');
        expect(dict.get('4')).toBe(undefined);
        expect(dict.hasKey('1')).toBe(true);
        expect(dict.hasKey('2')).toBe(true);
        expect(dict.hasKey('3')).toBe(true);
        expect(dict.hasKey('4')).toBe(false);
        expect(dict.toArray()).toMatchObject(['first', 'second', 'third']);
    });

    it('Should construct from object', () => {
        const values = {
            1: 'first',
            2: 'second',
            3: 'third'
        };

        const dict = new Dict(values);
        expect(dict).toBeInstanceOf(Dict);
        expect(dict.count()).toBe(3);
        expect(dict.get('1')).toBe('first');
        expect(dict.get('2')).toBe('second');
        expect(dict.get('3')).toBe('third');
        expect(dict.get('4')).toBe(undefined);
        expect(dict.hasKey('1')).toBe(true);
        expect(dict.hasKey('2')).toBe(true);
        expect(dict.hasKey('3')).toBe(true);
        expect(dict.hasKey('4')).toBe(false);
        expect(dict.toArray()).toMatchObject(['first', 'second', 'third']);
    });
});
