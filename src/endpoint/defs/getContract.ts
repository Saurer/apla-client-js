/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';
import { FieldType } from '../../types/contract';

type Request = {
    name: string;
};

type Response = {
    id: string;
    name: string;
    tableID: string;
    ecosystemID: string;
    walletID: string;
    tokenID: string;
    address: string;
    fields: {
        name: string;
        type: FieldType;
        optional: boolean;
    }[];
};

export default new Endpoint<Response, Request>({
    method: EndpointMethod.Get,
    route: 'contract/{name}',
    provideSlug: request => ({
        name: request.name
    }),
    responseTransformer: response => ({
        id: response.id,
        name: response.name,
        tableID: response.tableid,
        ecosystemID: response.state,
        walletID: response.walletid,
        tokenID: response.tokenid,
        address: response.address,
        fields: response.fields
    })
});