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
import { from, empty } from 'rxjs';
import { map, flatMap, catchError, toArray, take } from 'rxjs/operators';

export interface Options {
    transport: RequestTransport;
    fullNodes: string[];
}

export interface RequestTransport {
    (url: string, input: RequestInit): Promise<Response>;
}

export default class EndpointManager {
    private readonly _apiHost: string;
    private readonly _options: Options;

    public constructor(apiHost: string, options: Options) {
        this._apiHost = apiHost;
        this._options = options;
    }

    public get options() {
        return this._options;
    }

    public to = (nodeUrl: string) =>
        new EndpointManager(nodeUrl, this._options);

    public request = <TResponse, TRequest>(
        endpoint: Endpoint<TResponse, TRequest>,
        params: TRequest
    ) =>
        request({
            endpoint,
            params,
            transport: this._options.transport,
            apiHost: this._apiHost
        });

    public multicast = async <TResponse, TRequest>(
        endpoint: Endpoint<TResponse, TRequest>,
        params: TRequest
    ) =>
        from(this._options.fullNodes)
            .pipe(
                flatMap(
                    l =>
                        from(this.to(l).request(endpoint, params)).pipe(
                            map(response => response),
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
}
