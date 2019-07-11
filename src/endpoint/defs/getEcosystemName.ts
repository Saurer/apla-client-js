/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';

type Request = {
    name: string;
};

export default new Endpoint<string, Request>({
    method: EndpointMethod.Get,
    route: 'ecosystemname',
    provideParams: request => ({
        name: request.name
    }),
    responseTransformer: response =>
        String(response.ecosystem_name)
});