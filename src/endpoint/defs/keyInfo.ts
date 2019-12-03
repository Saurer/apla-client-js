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
import { AccountInfo } from '../../types/key';

interface NativeResponse {
    account: string;
    ecosystems: {
        ecosystem: string;
        name: string;
        roles: {
            id: string;
            name: string;
        }[];
        notifications: {
            role_id: string;
            count: string;
        }[];
    }[];
}

export default new Endpoint<AccountInfo, string>({
    method: EndpointMethod.Get,
    route: 'keyinfo/{id}',
    slug: request => ({
        id: request
    }),
    response: (response: NativeResponse, request) => ({
        keyID: request,
        account: response.account,
        ecosystems: response.ecosystems.map(ecosystem => ({
            id: ecosystem.ecosystem,
            name: ecosystem.name,
            roles: ecosystem.roles || [],
            notifications: (ecosystem.notifications || []).map(
                notification => ({
                    role: notification.role_id,
                    count: Number(notification.count) || 0
                })
            )
        }))
    })
});
