/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';
import { PaginationRequest, Page } from '../../types/pagination';
import providePagination from '../providers/providePagination';

type Request = PaginationRequest & {
    id: string;
    table: string;
};

type Response = Page<{
    [key: string]: any;
}>;

export default new Endpoint<Response, Request>({
    method: EndpointMethod.Get,
    route: 'history/{table}/{id}',
    provideSlug: request => ({
        table: request.table,
        id: Number(request.id)
    }),
    provideParams: providePagination,
    responseTransformer: response => ({
        count: '',
        data: response.list
    })
});