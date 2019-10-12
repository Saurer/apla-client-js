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

import endpoint from './getTables';
import { EndpointResponseType } from '..';

const testPayload = {
    offset: '128',
    limit: '256'
};

describe('GetTables', () => {
    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize(testPayload).getResponse(
                {
                    count: 8,
                    list: [
                        {
                            name: 'QA_TEST_NAME',
                            count: 'QA_TEST_COUNT'
                        }
                    ]
                },
                ''
            )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>({
            count: 8,
            data: [
                {
                    name: 'QA_TEST_NAME',
                    count: 'QA_TEST_COUNT'
                }
            ]
        });
    });

    it('Must correctly pass all expected params', () => {
        expect(endpoint.serialize(testPayload).body).toMatchObject({
            offset: '128',
            limit: '256'
        });
    });
});
