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
import { LocalizedRequest } from '../../types/locale';
import { ContentParams } from '../../types/interface';

type Request = LocalizedRequest & {
    name: string;
    ecosystemID: string;
    keyID: string;
    roleID: string;
    params: ContentParams;
};

interface NativeResponse {
    hash: string;
}

export default new Endpoint<string, Request>({
    method: EndpointMethod.Post,
    route: 'content/hash/{name}',
    slug: request => ({
        name: request.name
    }),
    body: request => ({
        ...request.params,
        lang: request.locale,
        ecosystem: request.ecosystemID,
        keyID: request.keyID,
        roleID: request.roleID
    }),
    response: (response: NativeResponse) => String(response.hash)
});
