/*---------------------------------------------------------------------------------------------
 *  Copyright (c) EGAAS S.A. All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';
import { PaginationRequest, Page } from '../../types/pagination';
import providePagination from '../providers/providePagination';

type Request = PaginationRequest;

type Response = Page<{
    id: string;
    name: string;
    value: string;
    keyID: string;
    address: string;
    conditions: string;
    tokenID: string;
    bound: boolean;
}>;

export default new Endpoint<Response, Request>({
    method: EndpointMethod.Get,
    route: 'contracts',
    provideParams: providePagination,
    responseTransformer: response => ({
        count: response.count,
        data: response.list.map((value: any) => ({
            id: value.id,
            name: value.name,
            value: value.value,
            keyID: value.key_id,
            address: value.address,
            tokenID: value.token_id,
            bound: '1' === value.active,
            conditions: value.conditions
        }))
    })
});
