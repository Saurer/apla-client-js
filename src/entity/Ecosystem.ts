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

import Entity from '.';
import Session from './Session';
import EndpointManager from '../endpointManager';
import balance from '../endpoint/defs/balance';
import dbFind from '../endpoint/defs/dbFind';
import getContract from '../endpoint/defs/getContract';
import Contract from './Contract';

export default class Ecosystem extends Entity {
    constructor(endpointManager: EndpointManager, session: Session) {
        super(endpointManager.elevate(session.apiToken));
        this.session = session;
        this.id = session.ecosystemID;
    }

    public readonly session: Session;
    public readonly id: string;

    public readonly getAccountBalance = this.bindDefaults(balance);
    public readonly dbFind = this.bindDefaults(dbFind);
    public readonly getContractData = this.bindDefaults(getContract);
    public readonly getContractByName = async (name: string) => {
        const data = await this.getContractData({ name });

        if (!data) {
            return null;
        }

        return new Contract(this.endpointManager, this, data);
    };
}
