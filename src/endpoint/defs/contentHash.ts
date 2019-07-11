/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';
import { LocalizedRequest } from '../../types/locale';
import { PageParams } from '../../types/interface';

type Request = LocalizedRequest & {
    locale: string;
    name: string;
    ecosystemID: string;
    keyID: string;
    roleID: string;
    params: PageParams;
};

export default new Endpoint<string, Request>({
    method: EndpointMethod.Post,
    route: 'content/hash/{name}',
    provideParams: request => ({
        ...request.params,
        lang: request.locale,
        ecosystem: request.ecosystemID,
        keyID: request.keyID,
        roleID: request.roleID
    }),
    responseTransformer: response =>
        String(response.hash)
});