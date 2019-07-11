/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';
import { KeyInfo } from '../../types/key';

type Request = {
    id: string;
};

export default new Endpoint<KeyInfo, Request>({
    method: EndpointMethod.Get,
    route: 'keyinfo/{id}',
    provideSlug: request => ({
        id: request.id
    }),
    responseTransformer: (response = []) => response.map((key: any) => ({
        name: key.name,
        ecosystemID: key.ecosystem,
        roles: key.roles || []
    }))
});