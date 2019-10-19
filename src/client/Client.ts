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

import urlJoin from 'url-join';
import queryString from 'query-string';
import { Middleware } from '../endpoint/middleware';
import { NetworkError } from '../types/error';
import Endpoint, {
    EndpointRequestType,
    AnyEndpoint,
    EndpointResponseType,
    ResponseType,
    EndpointMethod
} from '../endpoint';
import urlTemplate from 'url-template';

export interface ApiOptions {
    transport: RequestTransport;
    apiEndpoint?: string;
    headers?: {
        [key: string]: string;
    };
    middleware?: Middleware[];
}

export interface RequestTransport {
    (url: string, input: RequestInit): Promise<Response>;
}

export default abstract class Client {
    protected apiHost: string;
    protected options: ApiOptions;

    constructor(apiHost: string, options: ApiOptions) {
        this.apiHost = apiHost;
        this.options = options;
    }

    protected serializeBody = (
        values: {
            [key: string]: Array<object> | object;
        },
        formData = false
    ) => {
        const params = new (formData ? FormData : URLSearchParams)();
        for (let key in values) {
            const value = values[key];
            if (undefined === value || null === value) {
                continue;
            } else if (Array.isArray(value)) {
                value.forEach(subValue => params.append(key, String(subValue)));
            } else if (value instanceof Blob && formData) {
                params.append(key, value);
            } else {
                params.append(key, String(value));
            }
        }

        return params;
    };

    protected serializeQueryString = (values: { [key: string]: object }) => {
        return queryString.stringify(values, {
            arrayFormat: 'comma'
        });
    };

    protected serializeSlug = (
        template: string,
        params: { [key: string]: object }
    ) => {
        return urlTemplate.parse(template).expand(params);
    };

    protected executeMiddleware = (response: any) => {
        if (!this.options.middleware) {
            return response;
        }

        const result = this.options.middleware.reduce(
            (state, fn) => fn(state),
            response
        );

        return result;
    };

    protected shouldUseQueryParams = (method: EndpointMethod) => {
        return EndpointMethod.Get === method;
    };

    protected request = async <TResponse, TRequest>(
        endpoint: Endpoint<TResponse, TRequest>,
        params: TRequest,
        useFormData = false
    ) => {
        const useQuery = this.shouldUseQueryParams(endpoint.method);
        const request = endpoint.serialize(params);
        const route = this.serializeSlug(endpoint.route, request.slug);
        const query = useQuery
            ? '?' + this.serializeQueryString(request.body)
            : '';
        const body = useQuery
            ? null
            : this.serializeBody(request.body, useFormData);
        const requestUrl = urlJoin(
            this.apiHost,
            this.options.apiEndpoint || '',
            route,
            '?' === query ? '' : query
        );

        try {
            const response = await this.options.transport(requestUrl, {
                method: endpoint.method,
                mode: 'cors',
                headers: this.options.headers,
                body
            });

            let json: any = null;
            let plainText: string = '';

            switch (endpoint.responseType) {
                case ResponseType.Both:
                    plainText = await response.clone().text();
                    json = await response.json();
                    break;

                case ResponseType.PlainText:
                    plainText = await response.text();
                    break;

                case ResponseType.Json:
                    json = await response.json();
                    break;
            }

            const middlewareResult = this.executeMiddleware(json);
            return request.getResponse(middlewareResult, plainText);
        } catch (e) {
            throw new NetworkError(e);
        }
    };

    protected endpoint = <TResponse>(endpoint: Endpoint<TResponse>) => {
        return () => this.request(endpoint, undefined) as Promise<TResponse>;
    };

    protected parametrizedEndpoint = <
        TEndpoint extends AnyEndpoint,
        TDefaults extends Partial<EndpointRequestType<TEndpoint>>
    >(
        endpoint: TEndpoint,
        options: {
            useFormData?: boolean;
            defaultParams?: TDefaults;
        } = {}
    ) => {
        return (
            params: EndpointRequestWithDefaults<
                EndpointRequestType<TEndpoint>,
                TDefaults
            >
        ) =>
            this.request(
                endpoint,
                {
                    ...options.defaultParams,
                    ...params
                },
                options.useFormData
            ) as Promise<EndpointResponseType<TEndpoint>>;
    };
}

type EndpointRequestWithDefaults<TRequest, TDefaults = {}> = Pick<
    TRequest,
    Exclude<keyof TRequest, keyof TDefaults>
> &
    {
        [D in keyof TDefaults]?: TDefaults[D];
    };
