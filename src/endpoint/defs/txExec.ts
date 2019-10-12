/*---------------------------------------------------------------------------------------------
 *  Copyright (c) EGAAS S.A. All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';
import { SerializedTransaction } from '../../types/tx';

type Request = SerializedTransaction | SerializedTransaction[];

type Response = string[];

export default new Endpoint<Response, Request>({
    method: EndpointMethod.Post,
    route: 'sendTx',
    provideParams: request =>
        Array.prototype.concat(request).reduce((acc, tx) => {
            acc[tx.hash] = tx.body;
            return acc;
        }, {}),
    responseTransformer: response => Object.keys(response.hashes)
});
