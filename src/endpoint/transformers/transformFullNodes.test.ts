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

import transformFullNodes from './transformFullNodes';
import { FullNodeInfo } from '../../types/network';

describe('FullNodes transformer', () => {
    it('Should correctly transform input value', () => {
        const result = transformFullNodes({
            key_id: '256',
            public_key: 'qa_pkey',
            stopped: true,
            tcp_address: '::1',
            api_address: 'qa/test'
        });

        expect(result).toMatchObject<FullNodeInfo>({
            keyID: '256',
            publicKey: 'qa_pkey',
            stopped: true,
            tcpAddress: '::1',
            apiAddress: 'qa/test/api/v2'
        });
    });
});

export default transformFullNodes;
