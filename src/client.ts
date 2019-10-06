/*---------------------------------------------------------------------------------------------
 *  Copyright (c) EGAAS S.A. All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import urlJoin from 'url-join';
import queryString from 'query-string';
import { Middleware } from './endpoint/middleware';
import { NetworkError } from './types/error';
import Endpoint, {
    EndpointRequestType,
    AnyEndpoint,
    EndpointResponseType,
    ResponseType,
    EndpointMethod
} from './endpoint';
import urlTemplate from 'url-template';

export interface ApiOptions {
    transport: IRequestTransport;
    apiEndpoint?: string;
    headers?: {
        [key: string]: string;
    };
    middleware?: Middleware[];
}

export interface IRequestTransport {
    (url: string, input: RequestInit): Promise<Response>;
}

export default abstract class Client {
    protected apiHost: string;
    protected options: ApiOptions;

    constructor(apiHost: string, options: ApiOptions) {
        this.apiHost = apiHost;
        this.options = options;
    }

    protected serializeUrlSearchParams = (values: {
        [key: string]: Array<object> | object;
    }) => {
        const params = new URLSearchParams();
        for (let key in values) {
            const value = values[key];
            if (undefined === value || null === value) {
                continue;
            } else if (Array.isArray(value)) {
                value.forEach(subValue => params.append(key, String(subValue)));
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
        params: TRequest | void
    ) => {
        const useQuery = this.shouldUseQueryParams(endpoint.method);
        const request = params ? endpoint.serialize(params) : null;
        const route = request
            ? this.serializeSlug(endpoint.route, request.slug)
            : endpoint.route;
        const query =
            useQuery && request
                ? '?' + this.serializeQueryString(request.body)
                : '';
        const body =
            !useQuery && request
                ? this.serializeUrlSearchParams(request.body)
                : null;
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
            return request
                ? request.getResponse(middlewareResult, plainText)
                : undefined;
        } catch (e) {
            throw new NetworkError(e);
        }
    };

    protected endpoint = <TResponse>(endpoint: Endpoint<TResponse>) => {
        return () => this.request(endpoint) as Promise<TResponse>;
    };

    protected parametrizedEndpoint = <
        TEndpoint extends AnyEndpoint,
        TDefaults extends Partial<EndpointRequestType<TEndpoint>>
    >(
        endpoint: TEndpoint,
        defaultParams?: TDefaults
    ) => {
        return (
            params: EndpointRequestWithDefaults<
                EndpointRequestType<TEndpoint>,
                TDefaults
            >
        ) =>
            this.request(endpoint, {
                ...defaultParams,
                ...params
            }) as Promise<EndpointResponseType<TEndpoint>>;
    };
}

type EndpointRequestWithDefaults<TRequest, TDefaults = {}> = Pick<
    TRequest,
    Exclude<keyof TRequest, keyof TDefaults>
> &
    {
        [D in keyof TDefaults]?: TDefaults[D];
    };
