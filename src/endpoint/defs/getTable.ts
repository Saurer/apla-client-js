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
import { ColumnType } from '../../types/table';

type Request = {
    name: string;
};

type Response = {
    appID: string;
    name: string;
    conditions: string;
    permissions: {
        insert: string;
        newColumn: string;
        update: string;
        read?: string;
        filter?: string;
    };
    columns: {
        name: string;
        type: ColumnType;
        permissions: string;
    }[];
};

export default new Endpoint<Response, Request>({
    method: EndpointMethod.Get,
    route: 'table/{name}',
    slug: request => ({
        name: request.name
    }),
    response: response => ({
        appID: response.app_id,
        name: response.name,
        conditions: response.conditions,
        permissions: {
            insert: response.insert,
            newColumn: response.new_column,
            update: response.update,
            read: response.read,
            filter: response.filter
        },
        columns: response.columns.map((column: any) => ({
            name: column.name,
            type: column.type,
            permissions: column.perm
        }))
    })
});
