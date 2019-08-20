/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';

type Request = {
    id: string;
    ecosystemID: string;
    names?: string[];
};

type Response = {
    name: string;
    value: string;
    conditions: string;
}[];

export default new Endpoint<Response, Request>({
    method: EndpointMethod.Get,
    route: 'appparams/{id}',
    provideSlug: request => ({
        id: request.id
    }),
    provideParams: request => ({
        ecosystem: request.ecosystemID,
        names: request.names
    }),
    responseTransformer: response =>
        response.list
});