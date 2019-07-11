/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';

type Request = {
    [key: string]: Blob;
};

type Response = {
    [key: string]: string;
}

export default new Endpoint<Response, Request>({
    method: EndpointMethod.Post,
    route: 'sendTx',
    provideParams: request =>
        request,
    responseTransformer: response =>
        response.hashes
});