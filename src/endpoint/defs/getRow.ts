/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';

type Request = {
    table: string;
    column: string;
    value: string;
    columns: string[];
};

type Response = {
    id: string;
    [key: string]: any;
};

export default new Endpoint<Response, Request>({
    method: EndpointMethod.Get,
    route: 'row/{table}/{column}/{value}',
    provideSlug: request => ({
        table: request.table,
        column: request.column,
        value: request.value
    }),
    provideParams: request => ({
        columns: request.columns
    }),
    responseTransformer: response =>
        response.value
});