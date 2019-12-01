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

import Endpoint, { EndpointMethod, ResponseType } from '../';
import { LocalizedRequest } from '../../types/locale';
import { ContentPage, ContentParams } from '../../types/interface';

type Request = LocalizedRequest & {
    name: string;
    params: ContentParams;
};

export default new Endpoint<ContentPage, Request>({
    method: EndpointMethod.Post,
    route: 'content/page/{name}',
    responseType: ResponseType.Both,
    slug: request => ({
        name: request.name
    }),
    body: request => ({
        ...request.params,
        lang: request.locale
    }),
    response: (response, _request, plainText) => ({
        tree: response.tree || [],
        nodesCount: Number(response.nodesCount) || 0,
        menu: response.menu,
        menuTree: response.menuTree || [],
        plainText
    })
});
