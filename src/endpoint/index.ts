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

export enum EndpointMethod {
    Get = 'get',
    Post = 'post'
}

export enum ResponseType {
    Json = 0,
    PlainText,
    Both
}

type Provider<TRequest> = (request: TRequest) => { [key: string]: any };

export type AnyEndpoint = Endpoint<any, any>;

export interface EndpointParams<TResponse, TRequest = never> {
    method: EndpointMethod;
    route: string;
    responseType?: ResponseType;
    slug?: Provider<TRequest>;
    body?: Provider<TRequest>;
    query?: Provider<TRequest>;
    useFormData?: boolean;
    response?: (
        response: any,
        request: TRequest,
        plainText: string
    ) => Promise<TResponse> | TResponse;
}

export type EndpointRequestType<TEndpoint> = TEndpoint extends Endpoint<
    any,
    infer TRequest
>
    ? TRequest
    : unknown;

export type EndpointResponseType<TEndpoint> = TEndpoint extends Endpoint<
    infer TResponse,
    any
>
    ? TResponse
    : unknown;

class Endpoint<TResponse = void, TRequest = void> {
    private _params: EndpointParams<TResponse, TRequest>;

    constructor(params: EndpointParams<TResponse, TRequest>) {
        this._params = params;
    }

    get route() {
        return this._params.route;
    }

    get method() {
        return this._params.method;
    }

    get responseType() {
        return this._params.responseType || ResponseType.Json;
    }

    get useFormData() {
        return this._params.useFormData ?? false;
    }

    protected transformResponse = (
        response: any,
        request: TRequest,
        plainText: string
    ) =>
        this._params.response
            ? this._params.response(response, request, plainText)
            : response;

    public serialize = (params: TRequest) => {
        const slug = this._params.slug?.(params) ?? {};
        const query = this._params.query?.(params) ?? {};
        const body = this._params.body?.(params) ?? {};

        return {
            getResponse: (response: any, plainText: string) =>
                this.transformResponse(response, params, plainText),
            body,
            query,
            slug
        };
    };
}

export default Endpoint;
