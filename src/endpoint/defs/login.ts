/*---------------------------------------------------------------------------------------------
 *  Copyright (c) EGAAS S.A. All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import Endpoint, { EndpointMethod } from '../';

type Request = {
    ecosystemID: string;
    publicKey: string;
    signature: string;
    roleID: string;
    expiry: number;
    isMobile: boolean;
};

type Response = {
    token: string;
    ecosystemID: string;
    keyID: string;
    account: string;
    websocketToken: string;
    isNode: boolean;
    isOwner: boolean;
    timestamp: number;
};

function isTrue(value: string | boolean) {
    return value === true || 'true' === value;
}

export default new Endpoint<Response, Request>({
    method: EndpointMethod.Post,
    route: 'login',
    provideParams: request => ({
        ecosystem: request.ecosystemID,
        expire: request.expiry,
        pubkey: request.publicKey,
        signature: request.signature,
        role_id: request.roleID,
        mobile: request.isMobile
    }),
    responseTransformer: response => ({
        token: response.token,
        ecosystemID: response.ecosystem_id,
        keyID: response.key_id,
        account: response.account,
        websocketToken: response.notify_key,
        isNode: isTrue(response.isnode),
        isOwner: isTrue(response.isowner),
        timestamp: Number(response.timestamp)
    })
});
