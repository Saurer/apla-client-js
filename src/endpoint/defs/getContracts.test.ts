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

import endpoint from './getContracts';
import { EndpointResponseType } from '..';

const testPayload = {
    offset: 15,
    limit: 50
};

describe('GetContracts', () => {
    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize(testPayload).getResponse(
                {
                    count: '15',
                    list: [
                        {
                            id: 'QA_TEST_ID',
                            name: 'QA_TEST_NAME',
                            value: 'QA_TEST_VALUE',
                            key_id: 'QA_TEST_KEY',
                            address: 'QA_TEST_ADDRESS',
                            token_id: 'QA_TEST_TOKEN',
                            conditions: 'true',
                            active: '1'
                        }
                    ]
                },
                ''
            )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>({
            count: '15',
            data: [
                {
                    id: 'QA_TEST_ID',
                    name: 'QA_TEST_NAME',
                    value: 'QA_TEST_VALUE',
                    keyID: 'QA_TEST_KEY',
                    address: 'QA_TEST_ADDRESS',
                    tokenID: 'QA_TEST_TOKEN',
                    conditions: 'true',
                    bound: true
                }
            ]
        });
    });

    it('Must correctly pass all expected params', () => {
        expect(endpoint.serialize(testPayload).body).toMatchObject(testPayload);
    });
});
