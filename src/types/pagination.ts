/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

export interface PaginationRequest {
    offset?: string | number;
    limit?: string | number;
}

export interface Page<TValue> {
    count: string;
    data: TValue[];
}