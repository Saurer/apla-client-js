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

describe('AccountNotifications', () => {
    const emptyAccount = new Account(null!, null!, {
        keyID: 'QA_TEST_KEY_ID',
        account: 'QA_TEST_ACCOUNT',
        ecosystems: []
    });

    const account = new Account(null!, null!, {
        keyID: 'QA_TEST_KEY_ID',
        account: 'QA_TEST_ACCOUNT',
        ecosystems: [
            // This ecosystem is even. Roles count matches the notifications count
            {
                id: '1',
                name: 'ECOSYSTEM_ONE',
                roles: [
                    {
                        id: '1',
                        name: 'ROLE_ONE'
                    }
                ],
                notifications: [
                    {
                        role: '1',
                        count: 8
                    }
                ]
            },
            // This ecosystem is uneven. There are more roles than notifications
            {
                id: '2',
                name: 'ECOSYSTEM_TWO',
                roles: [
                    {
                        id: '1',
                        name: 'ROLE_ONE'
                    },
                    {
                        id: '2',
                        name: 'ROLE_TWO'
                    }
                ],
                notifications: [
                    {
                        role: '1',
                        count: 8
                    }
                ]
            },
            // This ecosystem is uneven. There are more notifications than roles
            {
                id: '3',
                name: 'ECOSYSTEM_THREE',
                roles: [
                    {
                        id: '1',
                        name: 'ROLE_ONE'
                    }
                ],
                notifications: [
                    {
                        role: '1',
                        count: 8
                    },
                    {
                        role: '2',
                        count: 16
                    }
                ]
            }
        ]
    });

    it('Should return correct notifications count', () => {
        expect(account.notifications.getNotificationsCount()).toBe(24);
    });

    it('Should return correct ecosystem notifications count', () => {
        expect(account.notifications.getEcosystemNotificationsCount('1')).toBe(
            8
        );
        expect(account.notifications.getEcosystemNotificationsCount('2')).toBe(
            8
        );
        expect(account.notifications.getEcosystemNotificationsCount('3')).toBe(
            8
        );
    });

    it('Should return correct role notifications count', () => {
        // Existing ecosystem, existing role, existing notification
        expect(account.notifications.getRoleNotificationsCount('1', '1')).toBe(
            8
        );

        // Existing ecosystem, existing role, non-existing notification
        expect(account.notifications.getRoleNotificationsCount('2', '2')).toBe(
            0
        );

        // Existing ecosystem, non-existing role, existing notification
        expect(account.notifications.getRoleNotificationsCount('3', '2')).toBe(
            0
        );

        // Non-existing ecosystem
        expect(
            account.notifications.getRoleNotificationsCount('-1', '-1')
        ).toBe(0);

        // Empty stack
        expect(emptyAccount.notifications.getNotificationsCount()).toBe(0);
        expect(
            emptyAccount.notifications.getEcosystemNotificationsCount('-1')
        ).toBe(0);
        expect(
            emptyAccount.notifications.getRoleNotificationsCount('-1', '-1')
        ).toBe(0);
    });
});
