/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import Client, { ApiOptions } from './client';
import { Middleware } from './endpoint/middleware';
import error from './endpoint/middleware/error';
import balance from './endpoint/defs/balance';
import getUid from './endpoint/defs/getUid';
import login from './endpoint/defs/login';
import authStatus from './endpoint/defs/authStatus';
import version from './endpoint/defs/version';

export interface AplaClientOptions extends ApiOptions {
    session?: string;
}

const defaultOptions: Partial<ApiOptions> = {
    apiEndpoint: '/api/v2',
    transport: typeof window !== 'undefined' ? window.fetch : undefined
};

const middleware: Middleware[] = [
    error
];

export default class AplaClient extends Client {
    constructor(nodeHost: string, options: AplaClientOptions) {
        super(nodeHost, {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers,
                ...(options.session && { Authorization: `Bearer ${options.session}` })
            },
            middleware: [
                ...middleware,
                ...(options.middleware || [])
            ]
        });
    }

    authorize = (session: string) =>
        new AplaClient(this.apiHost, {
            ...this.options,
            session
        });

    // Service endpoints
    version = this.endpoint(version);

    authStatus = this.endpoint(authStatus);
    balance = this.parametrizedEndpoint(balance);
    getUid = this.endpoint(getUid);
    login = this.parametrizedEndpoint(login, {
        ecosystemID: '1',
        roleID: '',
        expiry: 36000,
        isMobile: false
    });
}