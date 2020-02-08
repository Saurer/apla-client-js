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
import Centrifuge from 'centrifuge';
import { SocketConnectionError } from '../types/error';
import getConfig from '../endpoint/defs/getConfig';
import { ConfigType } from '../types/config';

interface FullNodeParams {
    apiAddress: string;
    tcpAddress: string;
}

export default class FullNode extends Entity {
    public constructor(
        endpointManager: EndpointManager,
        parentNetwork: Network,
        params: FullNodeParams
    ) {
        super(endpointManager.to(params.apiAddress));
        this.network = parentNetwork;
        this.apiAddress = params.apiAddress;
        this.tcpAddress = params.tcpAddress;
    }

    public readonly network: Network;
    public readonly apiAddress: string;
    public readonly tcpAddress: string;

    public readonly connect = async () => {
        const websocketHost = await this.endpointManager.request(getConfig, {
            type: ConfigType.WebsocketHost
        });

        return new Promise<Node>((resolve, reject) => {
            const socket = new Centrifuge(
                websocketHost + '/connection/websocket'
            );
            socket.setToken('');

            socket.on('connect', () => {
                resolve(new Node(this.endpointManager, this, socket));
            });

            socket.on('error', e => {
                reject(new SocketConnectionError(e));
            });

            socket.connect();
        });
    };
}
