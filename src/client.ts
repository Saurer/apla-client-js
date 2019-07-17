/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import urlJoin from 'url-join';
import Endpoint, { EndpointRequestType, AnyEndpoint, EndpointResponseType, ResponseType } from './endpoint';
import { Middleware } from './endpoint/middleware';

export interface ApiOptions {
    apiEndpoint?: string;
    transport?: IRequestTransport;
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
        this.options = {
            ...options,
            headers: options.headers || {},
            middleware: options.middleware || []
        };
    }

    protected serializeUrlSearchParams = (values: { [key: string]: Array<object> | object }) => {
        const params = new URLSearchParams();
        for (let key in values) {
            const value = values[key];
            if (undefined === value || null === value) {
                continue;
            }
            else if (Array.isArray(value)) {
                value.forEach(subValue =>
                    params.append(key, String(subValue))
                );
            }
            else {
                params.append(key, String(value));
            }
        }

        return params;
    };

    protected executeMiddleware = (response: any) => {
        let result = response;
        for (let handler of this.options.middleware) {
            result = handler(result);
        }

        return result;
    };

    protected request = async <TResponse, TRequest>(endpoint: Endpoint<TResponse, TRequest>, params?: TRequest) => {
        const routeEndpoint = endpoint.getRoute(params);
        const requestUrl = urlJoin(this.apiHost, this.options.apiEndpoint, routeEndpoint.route, routeEndpoint.query);
        const requestParams = endpoint.serialize(params);

        // TODO: NetworkError exception
        const response = await this.options.transport(requestUrl, {
            method: requestParams.method,
            mode: 'cors',
            headers: this.options.headers,
            body: ['get', 'head'].indexOf(requestParams.method.toLowerCase()) === -1 ?
                this.serializeUrlSearchParams(requestParams.form) :
                null
        });

        let json: any = null;
        let plainText: string | null = null;

        switch (requestParams.responseType) {
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
        return requestParams.getResponse(middlewareResult, plainText);
    };

    protected endpoint = <TResponse>(endpoint: Endpoint<TResponse>) => {
        return () => this.request(endpoint) as Promise<TResponse>;
    }

    protected parametrizedEndpoint = <TEndpoint extends AnyEndpoint, TDefaults extends Partial<EndpointRequestType<TEndpoint>>>(
        endpoint: TEndpoint,
        defaultParams?: TDefaults
    ) => {
        return (params: EndpointRequestWithDefaults<EndpointRequestType<TEndpoint>, TDefaults>) =>
            this.request(endpoint, {
                ...defaultParams,
                ...params
            }) as Promise<EndpointResponseType<TEndpoint>>;
    }
}

type EndpointRequestWithDefaults<TRequest, TDefaults = {}> =
    Pick<TRequest, Exclude<keyof TRequest, keyof TDefaults>> & {
        [D in keyof TDefaults]?: TDefaults[D];
    }