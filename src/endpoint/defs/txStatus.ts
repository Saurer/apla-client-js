/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';
import { TxStatusSuccess, TxStatusError } from '../../types/tx';

type Request = {
    hashes: string[];
};

type Response = {
    [hash: string]: TxStatusSuccess | TxStatusError;
}

export default new Endpoint<Response, Request>({
    method: EndpointMethod.Post,
    route: 'txstatus',
    provideParams: request => ({
        data: JSON.stringify({
            hashes: request.hashes
        })
    }),
    responseTransformer: response =>
        response.results
});