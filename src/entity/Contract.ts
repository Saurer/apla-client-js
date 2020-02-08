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
import EndpointManager from '../endpointManager';
import Ecosystem from './Ecosystem';
import txExec from '../endpoint/defs/txExec';
import txStatus from '../endpoint/defs/txStatus';
import getContract from '../endpoint/defs/getContract';
import ContractTx from '../tx/Contract';
import { TxStatusSuccess, TxStatusError, TxStatus } from '../types/tx';
import { RetryExceededError } from '../types/error';
import { EndpointResponseType } from '../endpoint';

export interface ContractOptions {
    statusMaxRetries?: number;
    statusRetryTimeout?: number;
    statusImmediate?: boolean;
}

const defaultOptions: ContractOptions = {
    statusMaxRetries: 30,
    statusRetryTimeout: 1500,
    statusImmediate: false
};

export default class Contract extends Entity {
    public constructor(
        endpointManager: EndpointManager,
        ecosystem: Ecosystem,
        data: EndpointResponseType<typeof getContract>
    ) {
        super(endpointManager);
        this.ecosystem = ecosystem;
        this.value = new ContractTx({
            id: Number(data.id),
            ecosystemID: Number(ecosystem.id),
            networkID: Number(ecosystem.session.account.node.network.networkID),
            fields: data.fields.reduce((fields, value) => {
                fields[value.name] = value.type;
                return fields;
            }, {})
        });
    }

    public readonly ecosystem: Ecosystem;
    public readonly value: ContractTx;

    public readonly execute = async (
        privateKey: string,
        params: { [key: string]: any } = {}
    ) => {
        const tx = await this.value.sign(privateKey, params);
        await this._txExec({ tx: [tx] });
        const status = await this._awaitStatus([tx.hash]);
        return status[0];
    };

    private readonly _options = defaultOptions;
    private readonly _txExec = this.bindDefaults(txExec);
    private readonly _txStatus = this.bindDefaults(txStatus);

    private readonly _isDone = (status: TxStatusSuccess | TxStatusError) => {
        if ('errmsg' in status) {
            return true;
        } else {
            return status.blockid !== '';
        }
    };

    private readonly _awaitStatus = async (hashes: string[]) => {
        let stack: TxStatus[] = [];
        let firstRun = true;
        let queryHashes = hashes;

        const timedStatus = (query: string[], immediate?: boolean) => {
            return new Promise<{
                done: TxStatus[];
                pending: string[];
            }>(resolve => {
                setTimeout(
                    async () => {
                        const status = await this._txStatus({
                            hashes: query
                        });
                        const done = query
                            .filter(hash => this._isDone(status[hash]))
                            .map(hash => ({
                                hash,
                                ...status[hash]
                            }));

                        const pending = query.filter(
                            hash => !this._isDone(status[hash])
                        );

                        resolve({
                            done,
                            pending
                        });
                    },
                    immediate ? 0 : this._options.statusRetryTimeout
                );
            });
        };

        for (let i = 0; i < this._options.statusMaxRetries!; i++) {
            const result = await timedStatus(
                queryHashes,
                firstRun || this._options.statusImmediate
            );

            firstRun = false;
            queryHashes = result.pending;
            stack = stack.concat(result.done);

            if (stack.length === hashes.length) {
                return stack.sort(
                    (a, b) => hashes.indexOf(a.hash) - hashes.indexOf(b.hash)
                );
            }
        }

        throw new RetryExceededError();
    };
}
