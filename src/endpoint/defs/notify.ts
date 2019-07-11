/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';

type Request = {
    id: string;
    ecosystemID: string;
}[];

export default new Endpoint<void, Request>({
    method: EndpointMethod.Post,
    route: 'updnotificator',
    provideParams: request => ({
        ids: JSON.stringify(request.map(r => ({
            id: r.id,
            ecosystem: r.ecosystemID
        })))
    }),
    responseTransformer: () => undefined
});