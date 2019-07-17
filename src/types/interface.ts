/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

export interface Interface {
    id: string;
    name: string;
    value: string;
    conditions: string;
}

export interface Page extends Interface {
    menu: string;
}

export interface ContentElement {
    tag: string;
    text?: string;
    attr?: { [key: string]: any };
    children?: ContentElement[] | null;
};

export interface Content {
    tree: ContentElement[];
}

export interface ContentPage extends Content {
    menu: string;
    nodesCount: number;
    menuTree: ContentElement[];
    plainText: string;
}

export interface ContentMenu extends Content {
    title: string;
}

export interface ContentParams {
    [Key: string]: any;
}