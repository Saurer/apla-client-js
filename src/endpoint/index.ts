/*---------------------------------------------------------------------------------------------
 *  Copyright (c) EGAAS S.A. All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

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
    provideSlug?: Provider<TRequest>;
    provideParams?: Provider<TRequest>;
    responseTransformer?: (
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

class Endpoint<TResponse, TRequest = void> {
    private _params: EndpointParams<TResponse, TRequest>;

    constructor(params: EndpointParams<TResponse, TRequest>) {
        this._params = params;
    }

    protected transformResponse = (
        response: any,
        request: TRequest,
        plainText: string
    ) => {
        if (this._params.responseTransformer) {
            return this._params.responseTransformer(
                response,
                request,
                plainText
            );
        } else {
            return response;
        }
    };

    public serialize = (params: TRequest) => {
        const slug = this._params.provideSlug
            ? this._params.provideSlug(params)
            : {};
        const body = this._params.provideParams
            ? this._params.provideParams(params)
            : {};

        return {
            method: this._params.method,
            route: this._params.route,
            responseType: this._params.responseType || ResponseType.Json,
            getResponse: (response: any, plainText: string) =>
                this.transformResponse(response, params, plainText),
            body,
            slug
        };
    };
}

export default Endpoint;
