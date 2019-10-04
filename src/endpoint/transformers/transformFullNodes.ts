/*---------------------------------------------------------------------------------------------
 *  Copyright (c) EGAAS S.A. All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { FullNode } from '../../types/network';

const transformFullNodes: (response: any) => FullNode = response => ({
    keyID: response.key_ud,
    publicKey: response.public_key,
    stopped: response.stopped,
    tcpAddress: response.tcp_address,
    apiAddress: response.api_address
});

export default transformFullNodes;
