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

import endpoint from './authStatus';
import { EndpointResponseType } from '../';

describe('AuthStatus', () => {
    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize().getResponse(
                {
                    active: true,
                    exp: '1024'
                },
                '',
                null as any
            )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>({
            active: true,
            expiry: 1024
        });
    });

    it('Must provide a fallback if certain properties are missing', () => {
        expect(
            endpoint.serialize().getResponse(
                {
                    active: false
                },
                '',
                null as any
            )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>({
            active: false,
            expiry: 0
        });
    });
});
