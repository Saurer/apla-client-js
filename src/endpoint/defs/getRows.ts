/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';
import { PaginationRequest, Page } from '../../types/pagination';
import providePagination from '../providers/providePagination';

type Request = PaginationRequest & {
    table: string;
    columns: string[];
};

type Response = Page<{
    id: string;
    [key: string]: any;
}>;

export default new Endpoint<Response, Request>({
    method: EndpointMethod.Get,
    route: 'list/{table}',
    provideSlug: request => ({
        table: request.table
    }),
    provideParams: request => ({
        ...(providePagination(request)),
        columns: request.columns
    }),
    responseTransformer: response => ({
        count: response.count,
        data: response.list
    })
});