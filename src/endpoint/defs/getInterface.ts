/*---------------------------------------------------------------------------------------------
 *  Copyright (c) EGAAS S.A. All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';
import { Interface, InterfaceType, Page } from '../../types/interface';
import transformInterface from '../transformers/transformInterface';

type Request = {
    name: string;
    type: InterfaceType;
};

type Response = Interface | Page;

export default new Endpoint<Response, Request>({
    method: EndpointMethod.Get,
    route: 'interface/{type}/{name}',
    provideSlug: request => ({
        name: request.name,
        type: request.type
    }),
    responseTransformer: transformInterface
});
