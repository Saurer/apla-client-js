/*---------------------------------------------------------------------------------------------
 *  Copyright (c) EGAAS S.A. All rights reserved.
 *  See LICENSE in the project root for license information.
 *---------------------------------------------------------------------------------------------*/

export interface FullNode {
    keyID: string;
    publicKey: string;
    stopped: boolean;
    tcpAddress: string;
    apiAddress: string;
}
