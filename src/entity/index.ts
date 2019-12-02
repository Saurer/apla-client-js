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

import EndpointManager from '../endpointManager';
import Endpoint from '../endpoint';

type EndpointRequestWithDefaults<TRequest, TDefaults = {}> = Pick<
    TRequest,
    Exclude<keyof TRequest, keyof TDefaults>
> &
    {
        [D in keyof TDefaults]?: TDefaults[D];
    };

export interface MulticastResponse<TResult> {
    count: number;
    date: Date;
    response: TResult;
}

export interface Multicast<TResponse> {
    (): Promise<MulticastResponse<TResponse>>;
    <TSelector>(selector: (response: TResponse) => TSelector): Promise<
        MulticastResponse<TSelector>
    >;
}

export interface MulticastParameters<TResponse, TRequest> {
    (params: TRequest): Promise<MulticastResponse<TResponse>>;
    <TSelector>(
        params: TRequest,
        selector: (response: TResponse) => TSelector
    ): Promise<MulticastResponse<TSelector>>;
}

export default abstract class Entity {
    private readonly _endpointManager: EndpointManager;

    public constructor(endpointManager: EndpointManager) {
        this._endpointManager = endpointManager;
    }

    protected bind = <TResponse>(endpoint: Endpoint<TResponse>) =>
        Object.assign(
            () => this._endpointManager.request(endpoint, undefined),
            {
                multicast: <Multicast<TResponse>>(
                    (<TSelector>(
                        selector?: (response: TResponse) => TSelector
                    ) =>
                        this._endpointManager.multicast(
                            endpoint,
                            undefined,
                            selector
                        ))
                )
            }
        );

    protected bindDefaults = <
        TResponse,
        TRequest,
        TDefaults extends Partial<TRequest>
    >(
        endpoint: Endpoint<TResponse, TRequest>,
        defaultParams?: TDefaults
    ) =>
        Object.assign(
            (params: EndpointRequestWithDefaults<TRequest, TDefaults>) =>
                this._endpointManager.request(endpoint, {
                    ...defaultParams,
                    ...params
                } as TRequest),
            {
                multicast: <
                    MulticastParameters<
                        TResponse,
                        EndpointRequestWithDefaults<TRequest, TDefaults>
                    >
                >(<TSelector>(
                    params: EndpointRequestWithDefaults<TRequest, TDefaults>,
                    selector?: (response: TResponse) => TSelector
                ) =>
                    this._endpointManager.multicast(
                        endpoint,
                        params as TRequest,
                        selector
                    ))
            }
        );

    protected bindParams = <TResponse, TRequest>(
        endpoint: Endpoint<TResponse, TRequest>,
        params: TRequest
    ) =>
        Object.assign(() => this._endpointManager.request(endpoint, params), {
            multicast: <Multicast<TResponse>>(
                (<TSelector>(selector?: (response: TResponse) => TSelector) =>
                    this._endpointManager.multicast(endpoint, params, selector))
            )
        });
}
