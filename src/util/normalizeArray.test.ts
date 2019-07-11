/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import normalizeArray from './normalizeArray';

describe('util/normalizeArray tests', () => {
    test('Empty array assertion', () => {
        const result = normalizeArray([], 'test');
        expect(result).toEqual({});
    });


    test('Key/value equality', () => {
        const input = [
            { id: 3, name: 'Third' },
            { id: 1, name: 'First' },
            { id: 2, name: 'Second' }
        ];

        const expected = {
            '1': { id: 1, name: 'First' },
            '2': { id: 2, name: 'Second' },
            '3': { id: 3, name: 'Third' }
        };

        const result = normalizeArray(input, 'id');
        expect(result).toEqual(expected);
    });
});