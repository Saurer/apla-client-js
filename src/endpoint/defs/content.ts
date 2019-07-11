/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';
import { LocalizedRequest } from '../../types/locale';
import { RenderableInterface, ContentPage, ContentMenu, PageParams } from '../../types/interface';

type Request = LocalizedRequest & {
    type: RenderableInterface;
    name: string;
    locale: string;
    params: PageParams;
};

type Response =
    ContentMenu | ContentPage;

export default new Endpoint<Response, Request>({
    method: EndpointMethod.Post,
    route: 'content/{type}/{name}',
    provideSlug: request => ({
        type: String(request.type),
        name: request.name
    }),
    provideParams: request => ({
        ...request.params,
        lang: request.locale
    }),
    responseTransformer: (response, request) => {
        const tree = response.tree || [];

        switch (request.type) {
            case RenderableInterface.Menu: return {
                tree,
                title: response.title || ''
            };

            case RenderableInterface.Page: return {
                tree,
                nodesCount: Number(response.nodesCount) || 0,
                menu: response.menu,
                menuTree: response.menuTree || []
            };

            // TODO: Throw
            default: throw 'E_INVALID_CONTENT';
        }
    }
});