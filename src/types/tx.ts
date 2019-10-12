/*---------------------------------------------------------------------------------------------
 *  Copyright (c) EGAAS S.A. All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Int64BE } from 'int64-buffer';

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

export type TransactionValue = string | number | Blob;

export interface Transaction {
    hash: string;
    contract_name: string;
    key_id: number;
    params: null | {
        [name: string]: TransactionValue;
    };
}

export enum TransactionType {
    Genesis = 0,
    Contract = 128
}

export interface DetailedTransaction extends Transaction {
    time: number;
    type: TransactionType;
}

export interface Block {
    header: {
        block_id: number;
        time: number;
        key_id: number;
        node_position: number;
        version: number;
    };
    hash: string;
    node_position: number;
    key_id: number;
    time: number;
    tx_count: number;
    rollbacks_hash: string;
    mrkl_root: string;
    stop_count: number;
    transactions: DetailedTransaction[];
}

export interface SerializedTransaction<TParams extends string = any> {
    hash: string;
    header: ArrayBuffer;
    body: ArrayBuffer;
    rawBody: {
        Header: {
            ID: number;
            Time: number;
            EcosystemID: number;
            KeyID: Int64BE;
            NetworkID: number;
            PublicKey: ArrayBuffer;
        };
        Params: {
            [K in TParams]: any;
        };
    };
}
