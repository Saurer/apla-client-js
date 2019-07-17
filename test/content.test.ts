/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import guestClient, { guestID } from './fixtures/guestClient';
import { APIError } from '../src/types/error';
import crypto from '../src/crypto';
import { toHex, toArrayBuffer } from '../src/convert';

describe('Content endpoints', () => {
    it('Should render default page', async () => {
        const client = await guestClient();
        const defaultPage = await client.renderPage({
            name: 'default_page',
            locale: 'en-US',
            params: {}
        });

        expect(defaultPage).toMatchObject({
            tree: [],
            nodesCount: 1,
            menu: 'default_menu',
            menuTree: []
        });
    });

    it('Should throw when page does not exist', async () => {
        const client = await guestClient();
        await expect(client.renderPage({ name: 'QA_NON_EXISTING_PAGE', locale: 'en-US' })).rejects.toThrow(new APIError(
            'E_NOTFOUND',
            'Page not found'
        ));
    });

    it('Should render default menu', async () => {
        const client = await guestClient();
        const defaultMenu = await client.renderMenu({
            name: 'default_menu',
            locale: 'en-US',
            params: {}
        });

        expect(defaultMenu).toMatchObject({
            tree: [],
            title: 'default'
        });
    });

    it('Should throw when menu does not exist', async () => {
        const client = await guestClient();
        await expect(client.renderMenu({ name: 'QA_NON_EXISTING_MENU', locale: 'en-US' })).rejects.toThrow(new APIError(
            'E_NOTFOUND',
            'Page not found'
        ));
    });

    it('Should return valid page hash', async () => {
        const client = await guestClient();
        const page = await client.renderPage({
            locale: 'en-US',
            name: 'default_page',
            params: []
        });
        const hash = await client.contentHash({
            locale: 'en-US',
            name: 'default_page',
            ecosystemID: '1',
            keyID: guestID,
            roleID: '0',
            params: {}
        });

        const textBuffer = await toArrayBuffer(page.plainText);
        const digest = await crypto.sha256(textBuffer);
        const hexDigest = toHex(digest);
        expect(hash).toBe(hexDigest);
    });

    it('Should return valid template source', async () => {
        const client = await guestClient();
        const template = await client.renderSource({
            locale: 'en-US',
            template: 'QA_#key_id#.Template test'
        });

        expect(template).toMatchObject({
            tree: [
                {
                    tag: 'text',
                    text: `QA_${guestID}.Template test`
                }
            ]
        })
    })
});