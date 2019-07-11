/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';
import { MetricType } from '../../types/metric';

type Request = {
    type: MetricType;
};

export default new Endpoint<number, Request>({
    method: EndpointMethod.Get,
    route: 'metrics/{type}',
    provideSlug: request => ({
        type: String(request.type)
    }),
    responseTransformer: response =>
        Number(response.count) || 0
});