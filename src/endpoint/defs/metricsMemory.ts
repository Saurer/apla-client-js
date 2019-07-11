/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';
import { MemUsage } from '../../types/metric';

export default new Endpoint<MemUsage>({
    method: EndpointMethod.Get,
    route: 'metrics/mem'
});