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

import Account from './Account';
import { EcosystemInfo } from '../types/key';
import EcosystemRolesDict from './EcosystemRolesDict';

export default class AccountEcosystem {
    constructor(account: Account, ecosystemInfo: EcosystemInfo) {
        this.account = account;
        this.id = ecosystemInfo.id;
        this.name = ecosystemInfo.name;
        this.roles = new EcosystemRolesDict(this, ecosystemInfo.roles);
    }

    public readonly account: Account;

    public readonly id: string;
    public readonly name: string;
    public readonly roles: EcosystemRolesDict;
}
