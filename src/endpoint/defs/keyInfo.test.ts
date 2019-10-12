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

import endpoint from './keyInfo';
import urlTemplate from 'url-template';
import { EndpointResponseType } from '..';

describe('KeyInfo', () => {
    it('Must provide required url slug', () => {
        const template = urlTemplate.parse(endpoint.route);
        expect(
            template.expand(endpoint.serialize({ id: 'QA_TEST_ID' }).slug)
        ).toBe('keyinfo/QA_TEST_ID');
    });

    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize({ id: 'QA_TEST_ID' }).getResponse(
                [
                    {
                        name: 'QA_TEST_NAME',
                        ecosystem: 'QA_TEST_ECOSYSTEM'
                    }
                ],
                ''
            )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>([
            {
                name: 'QA_TEST_NAME',
                ecosystemID: 'QA_TEST_ECOSYSTEM',
                roles: []
            }
        ]);

        expect(
            endpoint.serialize({ id: 'QA_TEST_ID' }).getResponse(
                [
                    {
                        name: 'QA_TEST_NAME',
                        ecosystem: 'QA_TEST_ECOSYSTEM',
                        roles: [
                            {
                                id: 'QA_TEST_ID',
                                name: 'QA_TEST_ROLE'
                            }
                        ]
                    }
                ],
                ''
            )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>([
            {
                name: 'QA_TEST_NAME',
                ecosystemID: 'QA_TEST_ECOSYSTEM',
                roles: [
                    {
                        id: 'QA_TEST_ID',
                        name: 'QA_TEST_ROLE'
                    }
                ]
            }
        ]);
    });
});
