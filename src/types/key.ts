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

export interface NotificationInfo {
    role: string;
    count: number;
}

export interface EcosystemInfo {
    id: string;
    name: string;
    roles: RoleInfo[];
    notifications: NotificationInfo[];
}

export interface RoleInfo {
    id: string;
    name: string;
}

export interface AccountInfo {
    keyID: string;
    account: string;
    ecosystems: EcosystemInfo[];
}

export interface LoginInfo {
    token: string;
    ecosystemID: string;
    keyID: string;
    account: string;
    websocketToken: string;
    isNode: boolean;
    isOwner: boolean;
    timestamp: number;
}
