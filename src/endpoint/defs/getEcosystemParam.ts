/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';

type Request = {
    name: string;
};

type Response = {
    id: string;
    name: string;
    value: string;
    conditions: string;
} | undefined;

export default new Endpoint<Response, Request>({
    method: EndpointMethod.Get,
    route: 'ecosystemparams',
    provideParams: request => ({
        names: request.name
    }),
    responseTransformer: response =>
        response.list[0]
});
