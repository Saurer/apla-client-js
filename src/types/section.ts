/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

enum SectionStatus {
    Removed = '0',
    Default = '1',
    Main = '2'
}

export interface Section {
    id: string;
    ecosystemID: string;
    title: string;
    status: SectionStatus;
    route: string;
    defaultPage: string;
    rolesAccess: string[];
}