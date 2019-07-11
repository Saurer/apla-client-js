/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';

type Response = {
    uid: string;
    token: string;
    networkID: number;
};

export default new Endpoint<Response>({
    method: EndpointMethod.Get,
    route: 'getuid',
    responseTransformer: response => ({
        token: response.token,
        networkID: Number(response.network_id),
        uid: 'LOGIN' + response.network_id + response.uid
    })
});