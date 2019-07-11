/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';

type Response = {
    active: boolean;
    expiry: number;
};

export default new Endpoint<Response>({
    method: EndpointMethod.Get,
    route: 'auth/status',
    responseTransformer: response => ({
        active: response.active,
        expiry: Number(response.exp) || 0
    })
});