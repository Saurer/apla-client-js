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

import Entity from '.';
import EndpointManager, { RequestTransport } from '../endpointManager';
import { from } from 'rxjs';
import { flatMap, map, take } from 'rxjs/operators';
import { FullNodeInfo } from '../types/network';
import network from '../endpoint/defs/network';
import FullNode from './FullNode';

interface NetworkParams {
    networkID: string;
    test: boolean;
    fullNodes: FullNodeInfo[];
    transport: RequestTransport;
    nodeUrl: string;
}

export interface NetworkConnectParams {
    transport: RequestTransport;
    fullNodes: string[];
}

export default class Network extends Entity {
    private constructor(params: NetworkParams) {
        const endpointManager = new EndpointManager(params.nodeUrl, {
            transport: params.transport,
            fullNodes: params.fullNodes
                .filter(l => !l.stopped)
                .map(l => l.apiAddress)
        });
        super(endpointManager);

        this.isTest = params.test;
        this.networkID = params.networkID;
        this.fullNodes = params.fullNodes.map(
            node =>
                new FullNode(endpointManager, this, {
                    apiAddress: node.apiAddress,
                    tcpAddress: node.tcpAddress
                })
        );
    }

    public readonly fullNodes: FullNode[];
    public readonly isTest: boolean;
    public readonly networkID: string;

    public static connect = (params: NetworkConnectParams) =>
        from(params.fullNodes)
            .pipe(
                map(
                    nodeUrl =>
                        [nodeUrl, new EndpointManager(nodeUrl, params)] as const
                ),
                flatMap(
                    ([nodeUrl, em]) =>
                        from(em.multicast(network, undefined)).pipe(
                            map(multicast => [nodeUrl, multicast] as const)
                        ),
                    1
                ),
                take(1),
                map(
                    ([nodeUrl, result]) =>
                        new Network({
                            transport: params.transport,
                            fullNodes: result.response.fullNodes,
                            test: result.response.test,
                            networkID: result.response.networkID,
                            nodeUrl
                        })
                )
            )
            .toPromise();
}
