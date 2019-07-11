/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';
import { NodeBan } from '../../types/metric';

export default new Endpoint<NodeBan[]>({
    method: EndpointMethod.Get,
    route: 'metrics/ban',
    responseTransformer: response =>
        response.map((node: any) => ({
            nodePosition: node.node_postition,
            status: node.status
        }))
});