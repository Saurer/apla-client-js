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

import endpoint from './getEcosystemParam';

describe('GetEcosystemParam', () => {
    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize({ name: 'QA_TEST_NAME' }).getResponse(
                {
                    list: [
                        {
                            id: 'QA_TEST_ID',
                            name: 'QA_TEST_NAME',
                            value: 'QA_TEST_VALUE',
                            conditions: 'QA_TEST_CONDITIONS'
                        }
                    ]
                },
                ''
            )
        ).toMatchObject({
            id: 'QA_TEST_ID',
            name: 'QA_TEST_NAME',
            value: 'QA_TEST_VALUE',
            conditions: 'QA_TEST_CONDITIONS'
        });

        expect(
            endpoint.serialize({ name: 'QA_TEST_NAME' }).getResponse(
                {
                    list: []
                },
                ''
            )
        ).toBe(undefined);
    });

    it('Must correctly pass all expected params', () => {
        expect(endpoint.serialize({ name: 'QA_TEST_NAME' }).body).toMatchObject(
            {
                names: 'QA_TEST_NAME'
            }
        );
    });
});
