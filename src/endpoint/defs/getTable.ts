/*---------------------------------------------------------------------------------------------
 *  Copyright (c) EGAAS S.A. All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';
import { ColumnType } from '../../types/table';

type Request = {
    name: string;
};

type Response = {
    appID: string;
    name: string;
    conditions: string;
    permissions: {
        insert: string;
        newColumn: string;
        update: string;
        read?: string;
        filter?: string;
    };
    columns: {
        name: string;
        type: ColumnType;
        permissions: string;
    }[];
};

export default new Endpoint<Response, Request>({
    method: EndpointMethod.Get,
    route: 'table/{name}',
    provideSlug: request => ({
        name: request.name
    }),
    responseTransformer: response => ({
        appID: response.app_id,
        name: response.name,
        conditions: response.conditions,
        permissions: {
            insert: response.insert,
            newColumn: response.new_column,
            update: response.update,
            read: response.read,
            filter: response.filter
        },
        columns: response.columns.map((column: any) => ({
            name: column.name,
            type: column.type,
            permissions: column.perm
        }))
    })
});
