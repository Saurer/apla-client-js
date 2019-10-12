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

import normalizeArray from './normalizeArray';

describe('util/normalizeArray tests', () => {
    test('Empty array assertion', () => {
        const result = normalizeArray([], 'test');
        expect(result).toEqual({});
    });

    test('Key/value equality', () => {
        const input = [
            { id: 3, name: 'Third' },
            { id: 1, name: 'First' },
            { id: 2, name: 'Second' }
        ];

        const expected = {
            '1': { id: 1, name: 'First' },
            '2': { id: 2, name: 'Second' },
            '3': { id: 3, name: 'Third' }
        };

        const result = normalizeArray(input, 'id');
        expect(result).toEqual(expected);
    });
});
