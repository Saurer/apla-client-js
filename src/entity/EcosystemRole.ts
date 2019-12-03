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

import AccountEcosystem from './AccountEcosystem';
import { RoleInfo } from '../types/key';

export default class EcosystemRole {
    constructor(ecosystem: AccountEcosystem, roleInfo: RoleInfo) {
        this.ecosystem = ecosystem;
        this.id = roleInfo.id;
        this.name = roleInfo.name;
    }

    public readonly ecosystem: AccountEcosystem;

    public readonly id: string;
    public readonly name: string;
}
