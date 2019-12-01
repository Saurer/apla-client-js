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
import { PaginationRequest, Page } from '../../types/pagination';
import providePagination from '../providers/providePagination';

type Request = PaginationRequest;

type Response = Page<{
    id: string;
    name: string;
    value: string;
    keyID: string;
    address: string;
    conditions: string;
    tokenID: string;
    bound: boolean;
}>;

export default new Endpoint<Response, Request>({
    method: EndpointMethod.Get,
    route: 'contracts',
    body: providePagination,
    response: response => ({
        count: response.count,
        data: response.list.map((value: any) => ({
            id: value.id,
            name: value.name,
            value: value.value,
            keyID: value.key_id,
            address: value.address,
            tokenID: value.token_id,
            bound: '1' === value.active,
            conditions: value.conditions
        }))
    })
});
