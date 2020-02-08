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

type DictConstructionType<TValue> =
    | [string, TValue][]
    | { [key: string]: TValue };

export default class Dict<TValue> {
    private readonly _values: Readonly<{
        [key: string]: Readonly<TValue>;
    }>;

    public constructor(values: DictConstructionType<TValue>) {
        if (Array.isArray(values)) {
            this._values = values.reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {});
        } else {
            this._values = values;
        }
    }

    readonly get = (key: string) => this._values[key];
    readonly hasKey = (key: string) => key in this._values;
    readonly count = () => Object.keys(this._values).length;
    readonly toArray = () =>
        Object.keys(this._values).map(key => this._values[key]);
}
