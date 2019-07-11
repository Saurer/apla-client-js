/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

export interface RoleInfo {
    id: string;
    name: string;
}

export interface KeyInfo {
    name: string;
    ecosystemID: string;
    roles: RoleInfo[];
}