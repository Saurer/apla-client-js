/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

export enum SectionStatus {
    Removed = '0',
    Main = '2'
}

export interface Section {
    id: string;
    title: string;
    status: SectionStatus;
    route: string;
    defaultPage: string;
}