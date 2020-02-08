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

import Account from './Account';
import EndpointManager from '../endpointManager';
import transport from '../__mocks__/transport';
import '../__mocks__/Blob';
import { defaultKey } from '../';
import Ecosystem from './Ecosystem';
import { hexToUint8Array, toUint8Array, publicToID } from '../convert';
import crypto from '../crypto';
import { ForeignKeyError } from '../types/error';

describe('Account', () => {
    it('Should perform login', async () => {
        const publicKey = await crypto.generatePublicKey(defaultKey);
        const keyID = await publicToID(publicKey);
        const mockTransport = transport();
        const endpointManager = new EndpointManager('QA_HOST', {
            transport: mockTransport,
            fullNodes: []
        });
        const account = new Account(endpointManager, null!, {
            keyID: keyID,
            account: 'QA_ACCOUNT',
            ecosystems: []
        });
        const uidSalt = 'LOGIN';
        const networkID = '1200';
        const uid = '4815162342';

        mockTransport.pushResponse(async (_url, request) => {
            const ecosystem = request.body.get('ecosystem');
            const pubkey = request.body.get('pubkey');
            const signature = request.body.get('signature');
            const sigBytes = hexToUint8Array(signature);
            const sigMsg = await toUint8Array(`${uidSalt}${networkID}${uid}`);
            const result = await crypto.verify(sigBytes, sigMsg, pubkey);

            if (result) {
                return {
                    token: 'QA_TEST_ELEVATED_TOKEN',
                    ecosystem_id: ecosystem,
                    key_id: 'QA_KEY_ID',
                    account: 'QA_ACCOUNT',
                    notify_key: 'QA_NOTIFY_KEY',
                    isnode: false,
                    isowner: true,
                    timestamp: '1234'
                };
            } else {
                throw 'E_INVALID_SIG';
            }
        });

        mockTransport.pushResponse(() => ({
            token: 'QA_TEST_TOKEN',
            network_id: networkID,
            uid
        }));

        await expect(account.login(defaultKey)).resolves.toBeInstanceOf(
            Ecosystem
        );
    });

    it('Should throw on login if provided private key differs from keyID', async () => {
        const mockTransport = transport();
        const endpointManager = new EndpointManager('QA_HOST', {
            transport: mockTransport,
            fullNodes: []
        });
        const account = new Account(endpointManager, null!, {
            keyID: 'QA_KEY_ID',
            account: 'QA_ACCOUNT',
            ecosystems: []
        });

        await expect(account.login(defaultKey)).rejects.toEqual(
            new ForeignKeyError()
        );
    });
});
