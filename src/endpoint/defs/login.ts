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

import Endpoint, { EndpointMethod } from '../';

type Request = {
    ecosystemID: string;
    publicKey: string;
    signature: string;
    roleID: string;
    expiry: number;
    isMobile: boolean;
};

type Response = {
    token: string;
    ecosystemID: string;
    keyID: string;
    account: string;
    websocketToken: string;
    isNode: boolean;
    isOwner: boolean;
    timestamp: number;
};

function isTrue(value: string | boolean) {
    return value === true || 'true' === value;
}

export default new Endpoint<Response, Request>({
    method: EndpointMethod.Post,
    route: 'login',
    body: request => ({
        ecosystem: request.ecosystemID,
        expire: request.expiry,
        pubkey: request.publicKey,
        signature: request.signature,
        role_id: request.roleID,
        mobile: request.isMobile
    }),
    response: response => ({
        token: response.token,
        ecosystemID: response.ecosystem_id,
        keyID: response.key_id,
        account: response.account,
        websocketToken: response.notify_key,
        isNode: isTrue(response.isnode),
        isOwner: isTrue(response.isowner),
        timestamp: Number(response.timestamp)
    })
});
