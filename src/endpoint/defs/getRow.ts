/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';

type Request = {
    id: string;
    table: string;
    column: string;
    columns: string[];
};

type Response = {
    id: string;
    value: {
        [key: string]: any;
    };
};

export default new Endpoint<Response, Request>({
    method: EndpointMethod.Get,
    route: 'row/{table}/{column}/{id}',
    provideSlug: request => ({
        table: request.table,
        column: request.column,
        id: Number(request.id)
    }),
    provideParams: request => ({
        columns: request.columns
    })
});