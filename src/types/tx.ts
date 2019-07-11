/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

export interface TxStatusSuccess {
    blockid: string;
    result?: string;
}

export interface TxStatusError {
    errmsg: {
        id?: string;
        type: string;
        error: string;
    };
}