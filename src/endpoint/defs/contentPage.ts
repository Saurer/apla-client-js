/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod, ResponseType } from '../';
import { LocalizedRequest } from '../../types/locale';
import { ContentPage, ContentParams } from '../../types/interface';

type Request = LocalizedRequest & {
    name: string;
    params: ContentParams;
};

export default new Endpoint<ContentPage, Request>({
    method: EndpointMethod.Post,
    route: 'content/page/{name}',
    responseType: ResponseType.Both,
    provideSlug: request => ({
        name: request.name
    }),
    provideParams: request => ({
        ...request.params,
        lang: request.locale
    }),
    responseTransformer: async (response, _request, plainText) => ({
        tree: response.tree || [],
        nodesCount: Number(response.nodesCount) || 0,
        menu: response.menu,
        menuTree: response.menuTree || [],
        plainText
    })
});