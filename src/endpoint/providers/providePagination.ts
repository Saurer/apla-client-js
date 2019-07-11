/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { PaginationRequest } from '../../types/pagination';

export default (request: PaginationRequest) => {
    const params: { [key: string]: string | number } = {};

    if (request.offset) {
        params['offset'] = request.offset;
    }

    if (request.limit) {
        params['limit'] = request.limit;
    }

    return params;
};