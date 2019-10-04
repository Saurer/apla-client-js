/*---------------------------------------------------------------------------------------------
 *  Copyright (c) EGAAS S.A. All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { NetworkError } from './error';

describe('NetworkError', () => {
    it('Should be instance of Error', () => {
        const error = new NetworkError('test');
        expect(error instanceof Error).toBeTruthy();
    });

    it('Should consume string type', () => {
        const stringError = new NetworkError('string');
        expect(stringError.baseError).toBe('string');
    });

    it('Should consume Error type', () => {
        const genericError = new Error('test');
        const networkError = new NetworkError(genericError);

        expect(networkError).toMatchObject({
            name: 'NetworkError',
            message: 'test',
            baseError: genericError
        });
    });

    it('Should handle unknown types', () => {
        const networkError = new NetworkError(64);

        expect(networkError).toMatchObject({
            name: 'NetworkError',
            message: 'Unknown error',
            baseError: 64
        });
    });
});
