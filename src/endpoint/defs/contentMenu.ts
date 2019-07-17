/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';
import { LocalizedRequest } from '../../types/locale';
import { ContentMenu, ContentParams } from '../../types/interface';

type Request = LocalizedRequest & {
    name: string;
    params: ContentParams;
};

export default new Endpoint<ContentMenu, Request>({
    method: EndpointMethod.Post,
    route: 'content/menu/{name}',
    provideSlug: request => ({
        name: request.name
    }),
    provideParams: request => ({
        ...request.params,
        lang: request.locale
    }),
    responseTransformer: response => ({
        tree: response.tree || [],
        title: response.title || ''
    })
});