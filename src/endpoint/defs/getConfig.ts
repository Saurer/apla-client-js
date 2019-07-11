/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';
import { ConfigType } from '../../types/config';

type Request = {
    type: ConfigType;
};

export default new Endpoint<string, Request>({
    method: EndpointMethod.Get,
    route: 'config/{type}',
    provideSlug: request => ({
        type: String(request.type)
    })
});