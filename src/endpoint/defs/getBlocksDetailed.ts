/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';
import { Block } from '../../types/tx';

type Request = {
    id: string;
    count: number;
};

type Response = {
    [block: string]: Block;
}

export default new Endpoint<Response, Request>({
    method: EndpointMethod.Get,
    route: 'detailed_blocks',
    provideParams: request => ({
        block_id: request.id,
        count: request.count
    })
});