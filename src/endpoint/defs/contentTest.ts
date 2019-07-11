/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';
import { LocalizedRequest } from '../../types/locale';
import { Content, PageParams } from '../../types/interface';

type Request = LocalizedRequest & {
    locale: string;
    template: string;
    params: PageParams;
};

type Response =
    Content;

export default new Endpoint<Response, Request>({
    method: EndpointMethod.Post,
    route: 'content',
    provideParams: request => ({
        ...request.params,
        lang: request.locale
    }),
    responseTransformer: response => ({
        tree: response.tree || []
    })
});