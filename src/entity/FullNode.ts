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

import Network from './Network';
import Node from './Node';
import Entity from '.';
import EndpointManager from '../endpointManager';

interface FullNodeParams {
    apiAddress: string;
    tcpAddress: string;
}

export default class FullNode extends Entity {
    public constructor(
        endpointManager: EndpointManager,
        network: Network,
        params: FullNodeParams
    ) {
        super(endpointManager);
        this.network = network;
        this.apiAddress = params.apiAddress;
        this.tcpAddress = params.tcpAddress;
        this.connect = () =>
            new Node(endpointManager.to(params.apiAddress), this);
    }

    public readonly network: Network;
    public readonly apiAddress: string;
    public readonly tcpAddress: string;

    public readonly connect: () => Node;
}
