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

import Endpoint, { EndpointMethod } from '../';
import transformFullNodes from '../transformers/transformFullNodes';
import { FullNodeInfo } from '../../types/network';

type Response = {
    networkID: string;
    centrifugoUrl: string;
    test: boolean;
    fullNodes: FullNodeInfo[];
};

interface NativeResponse {
    network_id: string;
    network_ud: string;
    centrifugo_url: string;
    test: boolean;
    full_nodes: {
        tcp_address: string;
        api_address: string;
        key_id: string;
        public_key: string;
        unban_time: string;
        stopped: boolean;
    }[];
}

export default new Endpoint<Response>({
    method: EndpointMethod.Get,
    route: 'network',
    response: (response: NativeResponse) => ({
        networkID: response.network_id ?? response.network_ud,
        centrifugoUrl: response.centrifugo_url,
        test: response.test,
        fullNodes: response.full_nodes.map(transformFullNodes)
    })
});
