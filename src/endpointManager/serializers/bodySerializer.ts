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

import { SimpleType, ComplexType } from '.';

type BodyType = SimpleType | ComplexType;

export default (
    values: {
        [key: string]: BodyType;
    },
    formData = false
) => {
    const params = new (formData ? FormData : URLSearchParams)();
    for (let key in values) {
        if (!Object.prototype.hasOwnProperty.call(values, key)) {
            continue;
        }

        const value = values[key];
        if (undefined === value || null === value) {
            continue;
        } else if (Array.isArray(value)) {
            value.forEach(subValue => params.append(key, String(subValue)));
        } else if (value instanceof Blob && formData) {
            params.append(key, value);
        } else {
            params.append(key, String(value));
        }
    }

    return params;
};
