/*---------------------------------------------------------------------------------------------
 *  Copyright (c) EGAAS S.A. All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';
import transformFullNodes from '../transformers/transformFullNodes';
import { FullNode } from '../../types/network';

type Response = {
    networkID: string;
    centrifugoUrl: string;
    test: boolean;
    fullNodes: FullNode[];
};

export default new Endpoint<Response>({
    method: EndpointMethod.Get,
    route: 'network',
    responseTransformer: response => ({
        networkID: response.network_ud,
        centrifugoUrl: response.centrifugo_url,
        test: response.test,
        fullNodes: response.full_nodes.map(transformFullNodes)
    })
});
