/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import AplaClient, { AplaClientOptions } from '../../src';
const fetch = require('node-fetch');

export default (apiHost: string, options?: AplaClientOptions) =>
    new AplaClient(apiHost, {
        ...options,
        transport: fetch
    });