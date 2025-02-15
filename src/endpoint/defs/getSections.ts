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
import { Section, SectionStatus } from '../../types/section';

type Request = LocalizedRequest;

type Response = {
    mainIndex: number;
    values: Section[];
};

export default new Endpoint<Response, Request>({
    method: EndpointMethod.Get,
    route: 'sections',
    body: request => ({
        lang: request.locale,
        offset: 0,
        limit: 10
    }),
    response: (response: { list: any[] }) => ({
        mainIndex: response.list.findIndex(
            section => section.status === SectionStatus.Main
        ),
        values: response.list.map(s => ({
            id: s.id,
            status: s.status,
            defaultPage: s.page,
            title: s.title,
            route: s.urlname
        }))
    })
});
