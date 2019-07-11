/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';

type Request = {
    account: string;
}

type Response = {
    amount: string;
    money: string;
}

export default new Endpoint<Response, Request>({
    method: EndpointMethod.Get,
    route: 'balance/{account}',
    provideSlug: request => ({
        account: request.account
    })
});