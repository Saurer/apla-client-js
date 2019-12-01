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

import urlJoin from 'url-join';
import { FullNodeInfo } from '../../types/network';

const transformFullNodes: (response: any) => FullNodeInfo = response => ({
    keyID: response.key_id,
    publicKey: response.public_key,
    stopped: response.stopped,
    tcpAddress: response.tcp_address,
    apiAddress: urlJoin(response.api_address, '/api/v2')
});

export default transformFullNodes;
