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
import { FieldType } from '../../types/contract';

type Request = {
    name: string;
};

type Response = {
    id: string;
    name: string;
    tableID: string;
    ecosystemID: string;
    keyID: string;
    tokenID: string;
    address: string;
    fields: {
        name: string;
        type: FieldType;
        optional: boolean;
    }[];
};

export default new Endpoint<Response, Request>({
    method: EndpointMethod.Get,
    route: 'contract/{name}',
    slug: request => ({
        name: request.name
    }),
    response: response => ({
        id: response.id,
        name: response.name,
        tableID: response.tableid,
        ecosystemID: response.state,
        keyID: response.walletid,
        tokenID: response.tokenid,
        address: response.address,
        fields: response.fields
    })
});
