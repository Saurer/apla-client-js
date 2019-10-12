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

import msgpack from 'msgpack-lite';
import schema from './schema';
import crypto from '../crypto';
import { Int64BE } from 'int64-buffer';
import { SerializedTransaction } from '../types/tx';
import {
    toUint8Array,
    concatBuffer,
    encodeLengthPlusData,
    publicToID,
    toHex
} from '../convert';

interface ContractContext<TParams extends string> {
    id: number;
    ecosystemID: number;
    networkID: number;
    fields: {
        [K in TParams]: keyof typeof schema.fields;
    };
}

export default class Contract<TParams extends string = any> {
    private _context: ContractContext<TParams>;

    constructor(context: ContractContext<TParams>) {
        this._context = context;
    }

    async sign(privateKey: string, params: { [K in TParams]: any }) {
        const publicKey = await crypto.generatePublicKey(privateKey);
        const keyID = await publicToID(publicKey);

        const data = await this.serialize({
            publicKey,
            keyID,
            params
        });
        const txHash = await crypto.SHA256(data.buffer);
        const resultHash = await crypto.SHA256(txHash);
        const signature = await crypto.sign(resultHash, privateKey);

        return {
            hash: toHex(resultHash),
            header: schema.header,
            rawBody: data.body,
            body: concatBuffer(
                schema.header,
                concatBuffer(
                    new Uint8Array(encodeLengthPlusData(data.buffer)),
                    new Uint8Array(
                        encodeLengthPlusData(new Uint8Array(signature))
                    )
                )
            )
        } as SerializedTransaction<TParams>;
    }

    protected async serialize(meta: {
        publicKey: string;
        keyID: string;
        params: { [K in TParams]: any };
    }) {
        const codec = msgpack.createCodec({
            binarraybuffer: true,
            preset: true
        });

        const params = (Object.keys(meta.params) as TParams[]).reduce(
            (acc, name) => {
                const type = this._context.fields[name];
                const field = schema.fields[type];
                const value = meta.params[name];

                if (
                    null !== value &&
                    undefined !== value &&
                    field.isCompatible(value)
                ) {
                    acc[name] = field(value);
                }

                return acc;
            },
            {} as { [K in TParams]: any }
        );

        const body = {
            Header: {
                ID: this._context.id,
                Time: Date.now(),
                EcosystemID: this._context.ecosystemID,
                KeyID: new Int64BE(meta.keyID),
                NetworkID: this._context.networkID,
                PublicKey: await toUint8Array(meta.publicKey)
            },
            Params: params
        };

        const txBuffer = msgpack.encode(body, { codec });

        return {
            buffer: txBuffer,
            body
        };
    }
}
