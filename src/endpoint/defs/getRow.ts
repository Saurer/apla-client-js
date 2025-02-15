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
    table: string;
    column: string;
    value: string;
    columns?: string[];
};

type Response = {
    id: string;
    [key: string]: any;
};

export default new Endpoint<Response, Request>({
    method: EndpointMethod.Get,
    route: 'row/{table}/{column}/{value}',
    slug: request => ({
        table: request.table,
        column: request.column,
        value: request.value
    }),
    body: request => ({
        columns: request.columns || []
    }),
    response: response => response.value
});
