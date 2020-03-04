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

import endpoint from './getRow';
import urlTemplate from 'url-template';

const testPayload = {
    table: 'QA_TEST_TABLE',
    column: 'QA_TEST_COLUMN',
    value: 'QA_TEST_VALUE'
};

describe('GetRow', () => {
    it('Must provide required url slug', () => {
        const template = urlTemplate.parse(endpoint.route);
        expect(template.expand(endpoint.serialize(testPayload).slug)).toBe(
            'row/QA_TEST_TABLE/QA_TEST_COLUMN/QA_TEST_VALUE'
        );
    });

    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize(testPayload).getResponse(
                {
                    value: {
                        id: 'QA_TEST_ID',
                        qaFirst: 'QA_FIRST',
                        qaSecond: 'QA_SECOND'
                    }
                },
                '',
                null as any
            )
        ).toMatchObject({
            id: 'QA_TEST_ID',
            qaFirst: 'QA_FIRST',
            qaSecond: 'QA_SECOND'
        });
    });

    it('Must correctly pass all expected params', () => {
        expect(
            endpoint.serialize({ ...testPayload, columns: ['first', 'second'] })
                .body
        ).toMatchObject({
            columns: ['first', 'second']
        });

        expect(endpoint.serialize(testPayload).body).toMatchObject({
            columns: []
        });
    });
});
