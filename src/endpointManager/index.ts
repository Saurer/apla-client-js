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

import Endpoint from '../endpoint';
import ValidationStrategy from './validationStrategy';
import request from './request';
import multicast from './multicast';
import crypto from '../crypto';
import getUid from '../endpoint/defs/getUid';
import login from '../endpoint/defs/login';
import { from, empty } from 'rxjs';
import { flatMap, catchError, toArray, take, map } from 'rxjs/operators';
import { toUint8Array, toHex } from '../convert';

export interface Options {
    transport: RequestTransport;
    fullNodes: string[];
    apiToken?: string;
}

export interface RequestTransport {
    (url: string, input: RequestInit): Promise<Response>;
}

export interface LoginParams {
    ecosystemID: string;
    expiry: number;
    isMobile: boolean;
}

export default class EndpointManager {
    protected readonly _apiHost: string;
    protected readonly _options: Options;

    public constructor(apiHost: string, options: Options) {
        this._apiHost = apiHost;
        this._options = options;
    }

    public get options() {
        return this._options;
    }

    public get isElevated() {
        return 'string' === typeof this._options.apiToken;
    }

    public readonly to = (nodeUrl: string) =>
        new EndpointManager(nodeUrl, this._options);

    public readonly elevate = (apiToken: string) =>
        new EndpointManager(this._apiHost, {
            ...this._options,
            apiToken
        });

    public readonly request = <TResponse, TRequest>(
        endpoint: Endpoint<TResponse, TRequest>,
        params: TRequest
    ) =>
        request({
            endpoint,
            params,
            transport: this._options.transport,
            apiHost: this._apiHost,
            headers: this.isElevated
                ? {
                      Authorization: `Bearer ${this._options.apiToken}`
                  }
                : {}
        });

    public readonly multicast = async <TResponse, TRequest, TSelector>(
        endpoint: Endpoint<TResponse, TRequest>,
        params: TRequest,
        selector?: (response: TResponse) => TSelector
    ) =>
        from(this._options.fullNodes)
            .pipe(
                flatMap(
                    apiAddress =>
                        from(
                            this.to(apiAddress).request(endpoint, params)
                        ).pipe(
                            map(response => selector?.(response) ?? response),
                            catchError(() => empty())
                        ),
                    3
                ),
                take(3),
                toArray(),
                flatMap(results =>
                    multicast(results, {
                        strategy: new ValidationStrategy(results)
                    })
                )
            )
            .toPromise();

    public readonly login = async (privateKey: string, params: LoginParams) => {
        const publicKey = await crypto.generatePublicKey(privateKey);
        const uid = await this.request(getUid, undefined);
        const uidBuffer = await toUint8Array(uid.uid);
        const sigBytes = await crypto.sign(uidBuffer, privateKey);
        const signature = toHex(sigBytes);

        return await this.elevate(uid.token).request(login, {
            // TODO: RoleID is omitted due to pending rework of the authentication process
            roleID: '0',
            publicKey,
            signature,
            ecosystemID: params.ecosystemID,
            isMobile: params.isMobile,
            expiry: params.expiry
        });
    };
}
