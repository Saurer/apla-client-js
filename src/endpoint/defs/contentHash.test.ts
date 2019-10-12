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

import endpoint from './contentHash';
import urlTemplate from 'url-template';

const testPayload = {
    name: 'QA_TEST_NAME',
    ecosystemID: 'QA_TEST_ECOSYSTEM',
    keyID: 'QA_TEST_KEY',
    roleID: 'QA_TEST_ROLE',
    locale: 'QA_TEST_LOCALE',
    params: {
        qaTestParam: 'QA_TEST_VALUE'
    }
};

describe('ContentHash', () => {
    it('Must provide required url slug', () => {
        const template = urlTemplate.parse(endpoint.route);
        expect(template.expand(endpoint.serialize(testPayload).slug)).toBe(
            'content/hash/QA_TEST_NAME'
        );
    });

    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize(testPayload).getResponse(
                {
                    hash: 'QA_TEST_PLAIN_STRING'
                },
                ''
            )
        ).toBe('QA_TEST_PLAIN_STRING');
    });

    it('Must correctly pass all expected params', () => {
        expect(endpoint.serialize(testPayload).body).toMatchObject({
            qaTestParam: 'QA_TEST_VALUE',
            lang: 'QA_TEST_LOCALE',
            ecosystem: 'QA_TEST_ECOSYSTEM',
            keyID: 'QA_TEST_KEY',
            roleID: 'QA_TEST_ROLE'
        });
    });
});
