/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';
import { PaginationRequest, Page } from '../../types/pagination';
import providePagination from '../providers/providePagination';

type Request = PaginationRequest;

type Response = Page<{
    name: string;
    count: string;
}>;

export default new Endpoint<Response, Request>({
    method: EndpointMethod.Get,
    route: 'tables',
    provideParams: providePagination,
    responseTransformer: response => ({
        count: response.count,
        data: response.list.map((value: any) => ({
            name: value.name,
            count: value.count
        }))
    })
});