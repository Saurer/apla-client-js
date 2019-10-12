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

import { Interface, Page } from '../../types/interface';

const transformInterface: (response: any) => Interface | Page = response => ({
    // Interface ID is handled incorrectly on the REST API provider. Force cast to string since value is big int
    id: String(response.id),
    name: response.name,
    value: response.value,
    conditions: response.conditions,
    ...(response.menu && { menu: response.menu })
});

export default transformInterface;
