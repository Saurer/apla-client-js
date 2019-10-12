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

import endpoint from './getTable';
import urlTemplate from 'url-template';
import { EndpointResponseType } from '..';

describe('GetTable', () => {
    it('Must provide required url slug', () => {
        const template = urlTemplate.parse(endpoint.route);
        expect(
            template.expand(endpoint.serialize({ name: 'QA_TEST_NAME' }).slug)
        ).toBe('table/QA_TEST_NAME');
    });

    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize({ name: 'QA_TEST_NAME' }).getResponse(
                {
                    app_id: 'QA_TEST_APP',
                    name: 'QA_TEST_NAME',
                    conditions: 'QA_TEST_CONDITIONS',
                    insert: 'QA_TEST_INSERT',
                    new_column: 'QA_TEST_NEWCOL',
                    update: 'QA_TEST_UPDATE',
                    read: 'QA_TEST_READ',
                    filter: 'QA_TEST_FILTER',
                    columns: [
                        {
                            name: 'QA_COL_NAME',
                            type: 'money',
                            perm: 'QA_COL_PERM'
                        }
                    ]
                },
                ''
            )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>({
            appID: 'QA_TEST_APP',
            name: 'QA_TEST_NAME',
            conditions: 'QA_TEST_CONDITIONS',
            permissions: {
                insert: 'QA_TEST_INSERT',
                newColumn: 'QA_TEST_NEWCOL',
                update: 'QA_TEST_UPDATE',
                read: 'QA_TEST_READ',
                filter: 'QA_TEST_FILTER'
            },
            columns: [
                {
                    name: 'QA_COL_NAME',
                    type: 'money',
                    permissions: 'QA_COL_PERM'
                }
            ]
        });
    });
});
