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

import endpoint from './getInterface';
import urlTemplate from 'url-template';
import { EndpointResponseType } from '..';

describe('GetInterface', () => {
    it('Must provide required url slug', () => {
        const template = urlTemplate.parse(endpoint.route);
        expect(
            template.expand(
                endpoint.serialize({
                    name: 'QA_TEST_NAME',
                    type: 'page'
                }).slug
            )
        ).toBe('interface/page/QA_TEST_NAME');
    });

    it('Must correctly transform response', () => {
        expect(
            endpoint
                .serialize({
                    name: 'QA_TEST_NAME',
                    type: 'page'
                })
                .getResponse(
                    {
                        id: 'QA_TEST_ID',
                        name: 'QA_TEST_NAME',
                        value: 'QA_TEST_VALUE',
                        conditions: 'QA_TEST_CONDITIONS'
                    },
                    '',
                    null as any
                )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>({
            id: 'QA_TEST_ID',
            name: 'QA_TEST_NAME',
            value: 'QA_TEST_VALUE',
            conditions: 'QA_TEST_CONDITIONS'
        });

        expect(
            endpoint
                .serialize({
                    name: 'QA_TEST_NAME',
                    type: 'page'
                })
                .getResponse(
                    {
                        id: 'QA_TEST_ID',
                        name: 'QA_TEST_NAME',
                        value: 'QA_TEST_VALUE',
                        menu: 'QA_TEST_MENU',
                        conditions: 'QA_TEST_CONDITIONS'
                    },
                    '',
                    null as any
                )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>({
            id: 'QA_TEST_ID',
            name: 'QA_TEST_NAME',
            value: 'QA_TEST_VALUE',
            menu: 'QA_TEST_MENU',
            conditions: 'QA_TEST_CONDITIONS'
        });
    });
});
