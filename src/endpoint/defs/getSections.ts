/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';
import { LocalizedRequest } from '../../types/locale';
import { Page } from '../../types/pagination';
import { Section } from '../../types/section';

type Request =
    LocalizedRequest;

type Response =
    Page<Section>;

export default new Endpoint<Response, Request>({
    method: EndpointMethod.Get,
    route: 'sections',
    provideParams: request => ({
        lang: request.locale
    }),
    responseTransformer: response => ({
        count: response.count,
        data: response.list
    })
});