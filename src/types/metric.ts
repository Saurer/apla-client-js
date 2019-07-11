/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

export enum MetricType {
    Keys = 'keys',
    Blocks = 'blocks',
    Transactions = 'transactions',
    Ecosystems = 'ecosystems',
    FullNodes = 'fullnodes'
}

export interface MemUsage {
    alloc: number;
    sys: number;
}

export interface NodeBan {
    nodePosition: number;
    status: boolean;
}