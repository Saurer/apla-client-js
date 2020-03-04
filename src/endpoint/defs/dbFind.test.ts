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

import endpoint from './dbFind';
import urlTemplate from 'url-template';
import { EndpointResponseType } from '..';

describe('DbFind', () => {
    it('Must provide required url slug', () => {
        const template = urlTemplate.parse(endpoint.route);
        expect(
            template.expand(endpoint.serialize({ table: 'QA_TEST_NAME' }).slug)
        ).toBe('dbfind/QA_TEST_NAME');
    });

    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize({ table: 'QA_TEST_NAME' }).getResponse(
                {
                    list: [
                        { id: 1, name: 'first' },
                        { id: 2, name: 'second' },
                        { id: 3, name: 'third' }
                    ]
                },
                '',
                null as any
            )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>([
            { id: 1, name: 'first' },
            { id: 2, name: 'second' },
            { id: 3, name: 'third' }
        ]);
    });

    it('Must properly handle where property', () => {
        expect(
            endpoint.serialize({
                table: 'QA_TEST_TABLE',
                where: { column: 'value' }
            }).body.where
        ).toBe(
            JSON.stringify({
                column: 'value'
            })
        );
    });

    it('Must properly handle where property if not specified', () => {
        expect(endpoint.serialize({ table: 'QA_TEST_TABLE' }).body.where).toBe(
            null as any
        );
    });
});
