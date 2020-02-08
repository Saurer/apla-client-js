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

export default class ValidationStrategy<TValue> {
    private _data: TValue[];

    public constructor(data: TValue[]) {
        this._data = data;
    }

    public validateErrors = () =>
        0 === this._data.filter(l => null === l).length;

    public validateEquality = async () =>
        this._data
            .filter(l => null !== l)
            .map(l => JSON.stringify(l))
            .every((value, _index, array) => value === array[0]);

    public validate = async () => {
        if (!this.validateErrors()) {
            return false;
        } else if (!(await this.validateEquality())) {
            return false;
        }

        return true;
    };
}
