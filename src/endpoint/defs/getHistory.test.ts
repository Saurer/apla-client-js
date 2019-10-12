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

import endpoint from './getHistory';
import urlTemplate from 'url-template';

describe('GetHistory', () => {
    it('Must provide required url slug', () => {
        const template = urlTemplate.parse(endpoint.route);
        expect(
            template.expand(
                endpoint.serialize({
                    id: '2048',
                    table: 'QA_TEST_TABLE'
                }).slug
            )
        ).toBe('history/QA_TEST_TABLE/2048');
    });

    it('Must correctly transform response', () => {
        expect(
            endpoint
                .serialize({
                    id: '2048',
                    table: 'QA_TEST_TABLE'
                })
                .getResponse(
                    {
                        list: [
                            {
                                first: 'hello',
                                second: 'world'
                            },
                            {
                                first: 'world',
                                second: 'hello'
                            }
                        ]
                    },
                    ''
                )
        ).toMatchObject([
            {
                first: 'hello',
                second: 'world'
            },
            {
                first: 'world',
                second: 'hello'
            }
        ]);
    });
});
