// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

export type InterfaceType = 'page' | 'menu' | 'block';

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
}

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
