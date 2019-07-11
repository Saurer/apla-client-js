/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';

type Request = {
    name: string;
};

export default new Endpoint<number, Request>({
    method: EndpointMethod.Get,
    route: 'page/validators_count/{name}',
    provideSlug: request => ({
        name: request.name
    }),
    responseTransformer: response =>
        Number(response.validate_count) || 0
});