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

import endpoint from './login';
import { EndpointResponseType } from '..';

const testPayload = {
    ecosystemID: 'QA_TEST_ECOSYSTEM',
    publicKey: 'QA_TEST_PUBLICKEY',
    signature: 'QA_TEST_SIGNATURE',
    roleID: 'QA_TEST_ROLE',
    expiry: 4096,
    isMobile: true
};

describe('Login', () => {
    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize(testPayload).getResponse(
                {
                    token: 'QA_TEST_TOKEN',
                    ecosystem_id: 'QA_TEST_ECOSYSTEM',
                    key_id: 'QA_TEST_KEY',
                    account: 'QA_TEST_ACCOUNT',
                    notify_key: 'QA_TEST_WEBSOCKET',
                    isnode: 'false',
                    isowner: 'true',
                    timestamp: '4815162342'
                },
                ''
            )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>({
            token: 'QA_TEST_TOKEN',
            ecosystemID: 'QA_TEST_ECOSYSTEM',
            keyID: 'QA_TEST_KEY',
            account: 'QA_TEST_ACCOUNT',
            websocketToken: 'QA_TEST_WEBSOCKET',
            isNode: false,
            isOwner: true,
            timestamp: 4815162342
        });
    });

    it('Must correctly pass all expected params', () => {
        expect(endpoint.serialize(testPayload).body).toMatchObject({
            ecosystem: 'QA_TEST_ECOSYSTEM',
            expire: 4096,
            pubkey: 'QA_TEST_PUBLICKEY',
            signature: 'QA_TEST_SIGNATURE',
            role_id: 'QA_TEST_ROLE',
            mobile: true
        });
    });
});
