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
import Account from './Account';
import EndpointManager from '../endpointManager';
import { LoginInfo } from '../types/key';

export interface SessionParams {
    ecosystemID: string;
    expiry: number;
    isMobile: boolean;
}

export default class Session extends Entity {
    public constructor(
        endpointManager: EndpointManager,
        account: Account,
        params: SessionParams,
        loginInfo: LoginInfo
    ) {
        super(endpointManager.elevate(loginInfo.token));
        this.account = account;
        this.apiToken = loginInfo.token;
        this.ecosystemID = loginInfo.ecosystemID;
        this.dateStart = new Date(loginInfo.timestamp * 1000);
        this.dateEnd = new Date(
            (loginInfo.timestamp + params.expiry! - 60) * 1000
        );
    }

    public readonly account: Account;
    public readonly apiToken: string;
    public readonly ecosystemID: string;
    public readonly dateStart: Date;
    public readonly dateEnd: Date;
}
