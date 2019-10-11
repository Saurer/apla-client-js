/*---------------------------------------------------------------------------------------------
 *  Copyright (c) EGAAS S.A. All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';

type Request = {
    id: string;
    table: string;
};

type Response = {
    [key: string]: any;
};

export default new Endpoint<Response, Request>({
    method: EndpointMethod.Get,
    route: 'history/{table}/{id}',
    provideSlug: request => ({
        table: request.table,
        id: Number(request.id)
    }),
    responseTransformer: response => response.list
});
