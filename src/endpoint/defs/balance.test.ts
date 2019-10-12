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

import endpoint from './balance';
import { EndpointResponseType } from '../';
import urlTemplate from 'url-template';

describe('Balance', () => {
    it('Must provide required url slug', () => {
        const template = urlTemplate.parse(endpoint.route);
        expect(
            template.expand(
                endpoint.serialize({ account: 'QA_TEST_ACCOUNT' }).slug
            )
        ).toBe('balance/QA_TEST_ACCOUNT');
    });

    it('Must provide a valid response', () => {
        expect(
            endpoint.serialize({ account: 'stub' }).getResponse(
                {
                    amount: '256',
                    money: '512'
                },
                ''
            )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>({
            amount: '256',
            money: '512'
        });
    });
});
