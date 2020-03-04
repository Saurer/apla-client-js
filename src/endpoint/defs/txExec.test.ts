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

import endpoint from './txExec';
import { EndpointResponseType } from '..';
import Contract from '../../tx/Contract';
import '../../__mocks__/Blob';

async function getTestPayload() {
    const testContact = new Contract({
        id: 256,
        ecosystemID: 128,
        networkID: 1024,
        fields: {
            Numeric: 'int',
            Text: 'string'
        }
    });

    const testPayload = await testContact.sign(
        'e5a87a96a445cb55a214edaad3661018061ef2936e63a0a93bdb76eb28251c1f',
        {
            Numeric: 4096,
            Text: 'Hello World!'
        }
    );

    return testPayload;
}

describe('TxExec', () => {
    it('Must correctly transform response', async () => {
        const testPayload = await getTestPayload();
        expect(
            endpoint.serialize({ tx: [testPayload] }).getResponse(
                {
                    hashes: {
                        [testPayload.hash]: testPayload.hash
                    }
                },
                '',
                null as any
            )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>([
            testPayload.hash
        ]);
    });

    it('Must correctly pass all expected params', async () => {
        const testPayload = await getTestPayload();

        expect(endpoint.serialize({ tx: testPayload }).body).toMatchObject({
            [testPayload.hash]: new Blob([testPayload.body])
        });

        expect(endpoint.serialize({ tx: [testPayload] }).body).toMatchObject({
            [testPayload.hash]: new Blob([testPayload.body])
        });
    });
});
