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

import endpoint from './getContract';
import urlTemplate from 'url-template';
import { EndpointResponseType } from '..';

const testPayload = {
    name: 'QA_TEST_NAME'
};

describe('GetContract', () => {
    it('Must provide required url slug', () => {
        const template = urlTemplate.parse(endpoint.route);
        expect(template.expand(endpoint.serialize(testPayload).slug)).toBe(
            'contract/QA_TEST_NAME'
        );
    });

    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize(testPayload).getResponse(
                {
                    id: 'QA_TEST_ID',
                    name: 'QA_TEST_NAME',
                    tableid: 'QA_TEST_TABLEID',
                    state: 'QA_TEST_ECOSYSTEM',
                    walletid: 'QA_TEST_KEY',
                    tokenid: 'QA_TEST_TOKEN',
                    address: 'QA_TEST_ADDRESS',
                    fields: [
                        {
                            name: 'QA_TEST_FIELD',
                            type: 'money',
                            optional: true
                        }
                    ]
                },
                ''
            )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>({
            id: 'QA_TEST_ID',
            name: 'QA_TEST_NAME',
            tableID: 'QA_TEST_TABLEID',
            ecosystemID: 'QA_TEST_ECOSYSTEM',
            keyID: 'QA_TEST_KEY',
            tokenID: 'QA_TEST_TOKEN',
            address: 'QA_TEST_ADDRESS',
            fields: [
                {
                    name: 'QA_TEST_FIELD',
                    type: 'money',
                    optional: true
                }
            ]
        });
    });
});
