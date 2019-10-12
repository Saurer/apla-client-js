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

import endpoint from './getRows';
import urlTemplate from 'url-template';

const testPayload = {
    offset: '16',
    limit: '32',
    table: 'QA_TABLE'
};

describe('GetRows', () => {
    it('Must provide required url slug', () => {
        const template = urlTemplate.parse(endpoint.route);
        expect(template.expand(endpoint.serialize(testPayload).slug)).toBe(
            'list/QA_TABLE'
        );
    });

    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize(testPayload).getResponse(
                {
                    count: '1',
                    list: [
                        {
                            id: 'QA_TEST_ID',
                            qaFirst: 'QA_FIRST',
                            qaSecond: 'QA_SECOND'
                        }
                    ]
                },
                ''
            )
        ).toMatchObject({
            count: '1',
            data: [
                {
                    id: 'QA_TEST_ID',
                    qaFirst: 'QA_FIRST',
                    qaSecond: 'QA_SECOND'
                }
            ]
        });
    });

    it('Must correctly pass all expected params', () => {
        expect(
            endpoint.serialize({ ...testPayload, columns: ['first', 'second'] })
                .body
        ).toMatchObject({
            offset: '16',
            limit: '32',
            columns: ['first', 'second']
        });

        expect(endpoint.serialize(testPayload).body).toMatchObject({
            offset: '16',
            limit: '32',
            columns: []
        });
    });
});
