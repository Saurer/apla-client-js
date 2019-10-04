/*---------------------------------------------------------------------------------------------
 *  Copyright (c) EGAAS S.A. All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { APIError } from '../../types/error';
import { Middleware } from '.';

const errorMiddleware: Middleware = response => {
    if (!response || 'object' !== typeof response) {
        return response;
    }

    if (!('error' in response && 'msg' in response)) {
        return response;
    }

    throw new APIError(
        String(response.error),
        String(response.msg),
        response.params
    );
};

export default errorMiddleware;
