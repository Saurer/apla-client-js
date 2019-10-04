/*---------------------------------------------------------------------------------------------
 *  Copyright (c) EGAAS S.A. All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import transformInterface from './transformInterface';
import { Interface, Page } from '../../types/interface';

describe('Interface transformer', () => {
    it('Should force cast interface ID to string', () => {
        const result = transformInterface({
            id: 4815162342
        });

        expect(result).toMatchObject({
            id: '4815162342'
        });
    });

    it('Should correctly transform interface types', () => {
        const result = transformInterface({
            id: 32,
            name: 'QA_TEST_NAME',
            value: 'QA_TEST_VALUE',
            conditions: 'QA_TEST_CONDITIONS'
        });

        expect(result).toMatchObject<Interface>({
            id: '32',
            name: 'QA_TEST_NAME',
            value: 'QA_TEST_VALUE',
            conditions: 'QA_TEST_CONDITIONS'
        });
    });

    it('Should correctly transform page type', () => {
        const result = transformInterface({
            id: 16,
            name: 'QA_TEST_PAGE',
            value: 'QA_TEST_VALUE',
            conditions: 'QA_TEST_CONDITIONS',
            menu: 'QA_TEST_MENU'
        });

        expect(result).toMatchObject<Page>({
            id: '16',
            name: 'QA_TEST_PAGE',
            value: 'QA_TEST_VALUE',
            conditions: 'QA_TEST_CONDITIONS',
            menu: 'QA_TEST_MENU'
        });
    });
});

export default transformInterface;
