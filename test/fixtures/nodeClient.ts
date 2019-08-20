/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import AplaClient, { AplaClientOptions } from '../../src/aplaClient';
import { apiHost } from './env';
const fetch = require('node-fetch');

export default (options?: AplaClientOptions, nodeHost = apiHost) =>
    new AplaClient(nodeHost, {
        ...options,
        transport: fetch
    });