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
import version from '../endpoint/defs/version';
import maxBlockID from '../endpoint/defs/maxBlockID';
import Metrics from './Metrics';
import getBlocks from '../endpoint/defs/getBlocks';
import getBlocksDetailed from '../endpoint/defs/getBlocksDetailed';
import getEcosystemName from '../endpoint/defs/getEcosystemName';
import getPageValidatorCount from '../endpoint/defs/getPageValidatorCount';
import contentHash from '../endpoint/defs/contentHash';
import keyInfo from '../endpoint/defs/keyInfo';
import FullNode from './FullNode';
import Network from './Network';
import Account from './Account';
import Centrifuge, { Subscription } from 'centrifuge';
import { TableEvent } from '../types/events';

export interface NodeOptions {
    transport: RequestTransport;
}

export default class Node extends Entity {
    public constructor(
        endpointManager: EndpointManager,
        fullNode: FullNode,
        socket: Centrifuge
    ) {
        super(endpointManager);
        this.metrics = new Metrics(endpointManager, this);
        this.fullNode = fullNode;
        this.network = fullNode.network;
        this._socket = socket;
    }

    private readonly _socket: Centrifuge;
    private readonly _tableListeners: {
        [table: string]: {
            subscription: Subscription;
            listeners: Array<(e: TableEvent) => void>;
        };
    } = {};

    public readonly fullNode: FullNode;
    public readonly network: Network;
    public readonly metrics: Metrics;

    public readonly getVersion = this.bind(version);
    public readonly getMaxBlockID = this.bind(maxBlockID);
    public readonly getContentHash = this.bindDefaults(contentHash);
    public readonly getAccountInfo = this.bindDefaults(keyInfo);
    public readonly getBlocks = this.bindDefaults(getBlocks);
    public readonly getBlocksDetailed = this.bindDefaults(getBlocksDetailed);
    public readonly getEcosystemName = this.bindDefaults(getEcosystemName);
    public readonly getPageValidatorsCount = this.bindDefaults(
        getPageValidatorCount
    );

    public readonly getAccount = async (keyID: string) => {
        const accountInfo = await this.getAccountInfo(keyID);
        return new Account(this.endpointManager, this, accountInfo);
    };

    public readonly subscribeTable = (
        table: string,
        callback: (e: TableEvent) => void
    ) => {
        if (!this._tableListeners[table]) {
            const subscription = this._socket.subscribe(
                `table_${table}`,
                (e: { data: any }) => {
                    this._tableListeners[table].listeners.forEach(listener =>
                        listener(e.data)
                    );
                }
            );
            this._tableListeners[table] = {
                subscription,
                listeners: []
            };
        }

        const value = this._tableListeners[table];
        value.listeners.push(callback);

        return () => {
            const listeners = value.listeners.filter(l => l !== callback);
            if (listeners.length) {
                this._tableListeners[table].listeners = listeners;
            } else {
                this._tableListeners[table].subscription.removeAllListeners();
                this._tableListeners[table].subscription.unsubscribe();
                delete this._tableListeners[table];
            }
        };
    };
}
