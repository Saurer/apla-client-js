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

import AplaClient, { SessionContainer } from '../client/AplaClient';
import Contract from '../tx/Contract';
import { TxStatusSuccess, TxStatusError, TxStatus } from '../types/tx';
import { RetryExceededError } from '../types/error';

export interface ContractServiceOptions {
    statusMaxRetries?: number;
    statusRetryTimeout?: number;
    statusImmediate?: boolean;
}

const defaultOptions = {
    statusMaxRetries: 30,
    statusRetryTimeout: 1500,
    statusImmediate: false
};

export default class {
    private _client: AplaClient;
    private _options: Required<ContractServiceOptions> & {
        session: SessionContainer;
    };

    constructor(
        client: AplaClient,
        options: ContractServiceOptions & { session: SessionContainer }
    ) {
        this._client = client;
        this._options = {
            ...defaultOptions,
            ...options
        };
    }

    isDone = (status: TxStatusSuccess | TxStatusError) => {
        if ('errmsg' in status) {
            return true;
        } else return 'blockid' in status;
    };

    fromID = async (id: string) => {
        const dbData = await this._client.getRow({
            table: 'contracts',
            value: id
        });

        if (!dbData) {
            return null;
        }

        return await this.fromName(dbData.name);
    };

    fromName = async (name: string) => {
        const meta = await this._client.getContract({
            name
        });

        if (!meta) {
            return null;
        }

        const contract = new Contract<string>({
            id: Number(meta.id),
            ecosystemID: Number(meta.ecosystemID),
            networkID: this._options.session.networkID,
            fields: meta.fields.reduce((fields, value) => {
                fields[value.name] = value.type;
                return fields;
            }, {})
        });

        return contract;
    };

    getStatus = async (hashes: string[]) => {
        let stack: TxStatus[] = [];
        let firstRun = true;
        let queryHashes = hashes;

        const timedStatus = (query: string[], immediate: boolean) => {
            return new Promise<{
                done: TxStatus[];
                pending: string[];
            }>(resolve => {
                setTimeout(
                    async () => {
                        const status = await this._client.txStatus(query);
                        const done = query
                            .filter(hash => this.isDone(status[hash]))
                            .map(hash => ({
                                hash,
                                ...status[hash]
                            }));

                        const pending = query.filter(
                            hash => !this.isDone(status[hash])
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

        for (let i = 0; i < this._options.statusMaxRetries; i++) {
            const result = await timedStatus(
                queryHashes,
                firstRun && this._options.statusImmediate
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

    execute = async (
        contract: Contract<string>,
        params: { [key: string]: any },
        privateKey: string
    ) => {
        const result = await this.executeBatch(
            [
                {
                    contract,
                    params
                }
            ],
            privateKey
        );

        return result[0];
    };

    executeBatch = async (
        data: {
            contract: Contract<string>;
            params: { [key: string]: any };
        }[],
        privateKey: string
    ) => {
        const txStack = await Promise.all(
            data.map(value => value.contract.sign(privateKey, value.params))
        );
        const hashes = txStack.map(tx => tx.hash);

        await this._client.txExec(txStack);
        return await this.getStatus(hashes);
    };
}
