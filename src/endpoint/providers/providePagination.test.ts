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

import providePagination from './providePagination';

describe('Pagination', () => {
    it('Should provide pagination if specified', () => {
        const request = { excess: 'params', offset: 10, limit: 12 };
        const params = providePagination(request);

        expect(params).toMatchObject<{ offset: number; limit: number }>({
            offset: 10,
            limit: 12
        });
    });

    it('Should provide pagination if no offset specified', () => {
        const request = { excess: 'params', limit: 12 };
        const params = providePagination(request);

        expect(params).toMatchObject<{ limit: number }>({
            limit: 12
        });
    });

    it('Should provide pagination if no limit specified', () => {
        const request = { excess: 'params', offset: 10 };
        const params = providePagination(request);

        expect(params).toMatchObject<{ offset: number }>({
            offset: 10
        });
    });

    it('Should return empty object if no valid params found', () => {
        const request = { excess: 'params' } as object;
        const params = providePagination(request);

        expect(params).toMatchObject<{}>({});
    });
});
