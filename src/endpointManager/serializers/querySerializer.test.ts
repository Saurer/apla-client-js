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

import querySerializer from './querySerializer';

describe('Query serializer', () => {
    it('Converts single value to query string', () =>
        expect(querySerializer({ test: 'QA_TEST_VALUE' })).toBe(
            'test=QA_TEST_VALUE'
        ));

    it('Converts multiple values to query string', () =>
        expect(
            querySerializer({
                first: 'QA_FIRST_VALUE',
                second: 'QA_SECOND_VALUE'
            })
        ).toBe('first=QA_FIRST_VALUE&second=QA_SECOND_VALUE'));
});
