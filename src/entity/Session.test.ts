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

import Session from './Session';
import EndpointManager from '../endpointManager';

describe('Session', () => {
    it('Should return correct data', () => {
        const endpointManager = new EndpointManager('QA_HOST', {
            transport: null!,
            fullNodes: []
        });
        const account = Symbol('Account') as any;
        const session = new Session(
            endpointManager,
            account,
            {
                ecosystemID: '8',
                expiry: 120000,
                isMobile: true
            },
            {
                token: 'QA_TOKEN',
                ecosystemID: '8',
                keyID: 'QA_KEY_ID',
                account: 'QA_ACCOUNT',
                websocketToken: 'QA_WEBSOCKET_TOKEN',
                isNode: true,
                isOwner: true,
                timestamp: 1024
            }
        );

        expect(session.account).toBe(account);
        expect(session.apiToken).toBe('QA_TOKEN');
        expect(session.dateStart).toEqual(new Date(1024 * 1000));
        expect(session.dateEnd).toEqual(new Date((1024 + 120000 - 60) * 1000));
    });
});
