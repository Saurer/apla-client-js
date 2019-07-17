/*---------------------------------------------------------------------------------------------
 *  Copyright (c) EGAAS S.A. All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import urlTemplate from 'url-template';
import queryString, { StringifyOptions } from 'query-string';

export enum EndpointMethod {
    Get = 'get',
    Post = 'post'
}

export enum ResponseType {
    Json = 0,
    PlainText,
    Both
}

const querySerializationStrategy: StringifyOptions = {
    arrayFormat: 'comma'
};

type Provider<TRequest> =
    (request: TRequest) => { [key: string]: any };

export type AnyEndpoint =
    Endpoint<any, any>;

export interface EndpointParams<TResponse, TRequest = never> {
    method: EndpointMethod;
    route: string;
    responseType?: ResponseType;
    provideSlug?: Provider<TRequest>;
    provideParams?: Provider<TRequest>;
    responseTransformer?: (response: any, request: TRequest, plainText: string) => Promise<TResponse> | TResponse;
}

export type EndpointRequestType<TEndpoint> =
    TEndpoint extends Endpoint<any, infer TRequest> ? TRequest : unknown;

export type EndpointResponseType<TEndpoint> =
    TEndpoint extends Endpoint<infer TResponse, any> ? TResponse : unknown;

const defaultParams: Partial<EndpointParams<any, any>> = {
    provideSlug: () => ({}),
    provideParams: () => ({}),
    responseTransformer: response => response
};

class Endpoint<TResponse, TRequest = never> {
    private _params: EndpointParams<TResponse, TRequest>;
    private _route: { expand: (params: { [name: string]: any }) => string };

    constructor(params: EndpointParams<TResponse, TRequest>) {
        this._params = {
            ...defaultParams,
            ...params
        };
        this._route = urlTemplate.parse(params.route);
    }

    public getRoute = (params: TRequest) => {
        const baseRoute = this._params.provideSlug ?
            this._route.expand(this._params.provideSlug(params)) :
            this._params.route;

        const query = EndpointMethod.Get === this._params.method && this._params.provideParams ?
            '?' + queryString.stringify(this._params.provideParams(params), querySerializationStrategy) :
            '';

        return {
            route: baseRoute,
            query
        };
    }

    public serialize = (params: TRequest) => {
        const route = this.getRoute(params);

        return {
            method: String(this._params.method),
            route: route.route,
            query: route.query,
            form: this._params.provideParams(params),
            responseType: this._params.responseType || ResponseType.Json,
            getResponse: (response: any, plainText: string) =>
                this._params.responseTransformer(response, params, plainText)
        };
    }
}

export default Endpoint;