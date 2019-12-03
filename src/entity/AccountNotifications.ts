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

type EcosystemNotificationsInfo = {
    ecosystem: string;
    roles: {
        role: string;
        count: number;
    }[];
}[];

export default class AccountNotifications {
    private _values: {
        [ecosystem: string]: {
            [role: string]: number;
        };
    };

    public constructor(
        account: Account,
        notificationsInfo: EcosystemNotificationsInfo
    ) {
        this.account = account;
        this._values = notificationsInfo.reduce(
            (ecosystemsStack, ecosystem) => {
                ecosystemsStack[ecosystem.ecosystem] = ecosystem.roles.reduce(
                    (rolesStack, role) => {
                        rolesStack[role.role] = role.count;
                        return rolesStack;
                    },
                    {}
                );

                return ecosystemsStack;
            },
            {}
        );
    }

    public readonly account: Account;

    public readonly getNotificationsCount = () => {
        const ecosystems = this.account.ecosystems.toArray();
        return ecosystems.reduce(
            (count, ecosystem) =>
                count + this.getEcosystemNotificationsCount(ecosystem.id),
            0
        );
    };

    public readonly getEcosystemNotificationsCount = (ecosystemID: string) => {
        const roles =
            this.account.ecosystems.get(ecosystemID)?.roles.toArray() ?? [];
        return roles.reduce(
            (count, role) =>
                count + this.getRoleNotificationsCount(ecosystemID, role.id),
            0
        );
    };

    public readonly getRoleNotificationsCount = (
        ecosystemID: string,
        roleID: string
    ) => {
        if (this.account.ecosystems.get(ecosystemID)?.roles.get(roleID)) {
            return this._values[ecosystemID][roleID] ?? 0;
        } else {
            return 0;
        }
    };
}
