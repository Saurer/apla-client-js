/*---------------------------------------------------------------------------------------------
 *  Copyright (c) EGAAS S.A. All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';
import normalizeArray from '../../util/normalizeArray';

type Request = {
    names: string[];
};

type Response = {
    [key: string]: {
        name: string;
        value: string;
        conditions: string;
    };
};

export default new Endpoint<Response, Request>({
    method: EndpointMethod.Get,
    route: 'systemparams',
    provideParams: request => ({
        names: request.names
    }),
    responseTransformer: response =>
        normalizeArray<{ name: string; value: string; conditions: string }>(
            response.list,
            'name'
        )
});
