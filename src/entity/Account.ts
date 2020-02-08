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

import Node from './Node';
import Entity from '.';
import EndpointManager from '../endpointManager';
import { AccountInfo } from '../types/key';
import AccountEcosystemsDict from './AccountEcosystemsDict';
import AccountNotifications from './AccountNotifications';
import Session from './Session';
import Ecosystem from './Ecosystem';
import { publicToID } from '../convert';
import crypto from '../crypto';
import { ForeignKeyError } from '../types/error';

export interface LoginParams {
    ecosystemID?: string;
    expiry?: number;
    isMobile?: boolean;
}

export default class Account extends Entity {
    public constructor(
        endpointManager: EndpointManager,
        node: Node,
        params: AccountInfo
    ) {
        super(endpointManager);
        this.node = node;
        this.keyID = params.keyID;
        this.account = params.account;
        this.ecosystems = new AccountEcosystemsDict(this, params.ecosystems);
        this.notifications = new AccountNotifications(
            this,
            params.ecosystems.map(ecosystem => ({
                ecosystem: ecosystem.id,
                roles: ecosystem.notifications
            }))
        );
    }

    public readonly node: Node;

    public readonly keyID: string;
    public readonly account: string;
    public readonly ecosystems: AccountEcosystemsDict;
    public readonly notifications: AccountNotifications;

    public readonly login = async (
        privateKey: string,
        params?: LoginParams
    ) => {
        const loginParams = {
            ecosystemID: '1',
            expiry: 36000,
            isMobile: false,
            ...params
        };

        const publicKey = await crypto.generatePublicKey(privateKey);
        const keyID = await publicToID(publicKey);

        if (keyID !== this.keyID) {
            throw new ForeignKeyError();
        }

        const loginInfo = await this.endpointManager.login(
            privateKey,
            loginParams
        );

        const session = new Session(
            this.endpointManager,
            this,
            loginParams,
            loginInfo
        );

        return new Ecosystem(this.endpointManager, session);
    };
}
