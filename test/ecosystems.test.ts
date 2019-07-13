/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import guestClient from './fixtures/guestClient';
import { APIError } from '../src/types/error';

describe('Ecosystem endpoints', () => {
    it('Should always return current ecosystem name', async () => {
        const client = await guestClient();
        const ecosystemName = await client.getEcosystemName({ id: '1' });
        expect(ecosystemName).toBe('platform ecosystem');
    });

    it('Should throw with empty parameter', async () => {
        const client = await guestClient();
        await expect(client.getEcosystemName({ id: '' })).rejects.toThrow(new APIError(
            'E_PARAMNOTFOUND',
            'Parameter name has not been found'
        ));
    });

    it('Should return ecosystem parameters', async () => {
        const client = await guestClient();
        const params = await client.getEcosystemParams({
            names: [
                'founder_account',
                'error_page'
            ]
        });

        expect(params.founder_account).toMatchShapeOf({
            id: '',
            value: '',
            conditions: ''
        });
        expect(params.founder_account.name).toEqual('founder_account');

        expect(params.error_page).toMatchShapeOf({
            id: '',
            value: '',
            conditions: ''
        });
        expect(params.error_page.name).toEqual('error_page');
    });

    it('Should return partial results for mixed existing/non-existing params', async () => {
        const client = await guestClient();
        const params = await client.getEcosystemParams({
            names: [
                'founder_account',
                'QA_NON_EXISTING_PARAM'
            ]
        });

        expect(params.founder_account).toBeTruthy();
        expect(params.QA_NON_EXISTING_PARAM).toBeFalsy();
    });

    it('Should return single ecosystem parameter', async () => {
        const client = await guestClient();
        const founderAccount = await client.getEcosystemParam({
            name: 'founder_account'
        });

        expect(founderAccount).toMatchShapeOf({
            id: '',
            value: '',
            conditions: ''
        });
        expect(founderAccount.name).toEqual('founder_account');
    });

    it('Should return undefined when no parameter is found', async () => {
        const client = await guestClient();
        const nonExisting = await client.getEcosystemParam({
            name: 'QA_NON_EXISTING_PARAM'
        });

        expect(nonExisting).toBe(undefined);
    });

    it('Should return tables', async () => {
        const client = await guestClient();
        const tables = await client.getTables({
            offset: 0,
            limit: 10
        });

        expect(typeof tables.count).toBe('number');
        expect(tables.data.length).toBeLessThanOrEqual(10);
        tables.data.forEach(table => {
            expect(table).toMatchShapeOf({
                name: '',
                count: ''
            });
        });
    });

    it('Should return determined pagination', async () => {
        const client = await guestClient();
        const tables1 = await client.getTables({ offset: 0, limit: 3 });
        const tables2 = await client.getTables({ offset: 1, limit: 2 });
        const tables3 = await client.getTables({ offset: 2, limit: 1 });

        expect(tables1.data.length).toEqual(3);
        expect(tables2.data.length).toEqual(2);
        expect(tables3.data.length).toEqual(1);
        expect(tables1.data[1]).toEqual(tables2.data[0]);
        expect(tables1.data[2]).toEqual(tables2.data[1]);
        expect(tables2.data[1]).toEqual(tables3.data[0]);
    });

    it('Should return table data', async () => {
        const client = await guestClient();
        const table = await client.getTable({
            name: 'keys'
        });

        expect(table).toMatchShapeOf({
            conditions: '',
            permissions: {
                insert: '',
                newColumn: '',
                update: '',
            }
        });
        expect(table.appID).toBe('1');
        expect(table.name).toBe('keys');
        expect(table.columns).toContainEqual({
            name: 'pub',
            permissions: 'false',
            type: 'bytea'
        });
        expect(table.columns).toContainEqual({
            name: 'account',
            permissions: 'false',
            type: 'character'
        });
    });

    it('Should ignore table name case', async () => {
        const client = await guestClient();
        const table = await client.getTable({ name: 'KeYs' });
        expect(table.name).toBe('keys');
    });

    it('Should throw when table does not exist', async () => {
        const client = await guestClient();
        await expect(client.getTable({ name: 'QA_TEST_TABLE_NOT_EXISTS' })).rejects.toThrowError(new APIError(
            'E_TABLENOTFOUND',
            'Table QA_TEST_TABLE_NOT_EXISTS has not been found'
        ));
    });

    it('Should not be able to read tables from another ecosystem', async () => {
        const client = await guestClient();
        await expect(client.getTable({ name: '2_keys' })).rejects.toThrowError();
    });

    it('Should return table rows', async () => {

        const client = await guestClient();
        const rows = await client.getRows({ table: 'keys' });

        expect(Number(rows.count)).toBeGreaterThanOrEqual(2);
        rows.data.forEach(row => {
            expect(row).toMatchShapeOf({
                id: '',
                pub: '',
                account: ''
            });
        });
    });

    it('Should provide deterministic pagination', async () => {
        const client = await guestClient();
        const rows1 = await client.getRows({ table: 'keys', offset: 0, limit: 2 });
        const rows2 = await client.getRows({ table: 'keys', offset: 1, limit: 1 });

        expect(rows1.data.length).toBe(2);
        expect(rows2.data.length).toBe(1);
        expect(rows1.data[1]).toMatchObject(rows2.data[0]);
    });

    test.todo('AppParam');
    test.todo('AppParams');
});