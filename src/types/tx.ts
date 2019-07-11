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

export interface Blob {
    Body: string;
    MimeType: string;
    Name: string;
}

export type TransactionValue =
    string | number | Blob;

export interface Transaction {
    hash: string;
    contract_name: string;
    key_id: number;
    params: null | {
        [name: string]: TransactionValue;
    }
}