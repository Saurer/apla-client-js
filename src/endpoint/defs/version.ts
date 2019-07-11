/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';

export default new Endpoint<string>({
    method: EndpointMethod.Get,
    route: 'version',
    responseTransformer: response =>
        String(response)
});