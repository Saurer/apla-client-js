/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';

type Request = {
    id: string;
};

export default new Endpoint<string, Request>({
    method: EndpointMethod.Get,
    route: 'ecosystemname',
    provideParams: request => ({
        id: request.id
    }),
    responseTransformer: response =>
        String(response.ecosystem_name)
});