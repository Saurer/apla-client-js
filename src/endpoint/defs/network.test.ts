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

import endpoint from './network';
import { EndpointResponseType } from '..';

describe('Network', () => {
    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize().getResponse(
                {
                    network_ud: '1024',
                    centrifugo_url: 'QA_TEST_URL',
                    test: true,
                    full_nodes: [
                        {
                            key_id: '256',
                            public_key: 'QA_TEST_PUBLIC_KEY',
                            stopped: true,
                            tcp_address: 'QA_TEST_TCP',
                            api_address: 'QA_TEST_API'
                        }
                    ]
                },
                ''
            )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>({
            networkID: '1024',
            centrifugoUrl: 'QA_TEST_URL',
            test: true,
            fullNodes: [
                {
                    keyID: '256',
                    publicKey: 'QA_TEST_PUBLIC_KEY',
                    stopped: true,
                    tcpAddress: 'QA_TEST_TCP',
                    apiAddress: 'QA_TEST_API/api/v2'
                }
            ]
        });
    });
});
