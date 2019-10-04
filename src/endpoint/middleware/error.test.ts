/*---------------------------------------------------------------------------------------------
 *  Copyright (c) EGAAS S.A. All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import errorMiddleware from './error';
import { APIError } from '../../types/error';

describe('Error middleware', () => {
    it('Should not throw when response is empty object', () => {
        expect(() => {
            errorMiddleware({});
        }).not.toThrow();
    });

    it('Should not throw when response is undefined', () => {
        expect(() => {
            errorMiddleware(undefined);
        }).not.toThrow();
    });

    it('Should not throw when response is not an object', () => {
        expect(() => {
            errorMiddleware(4815162342);
        }).not.toThrow();

        expect(() => {
            (errorMiddleware as any)();
        }).not.toThrow();
    });

    it('Should not throw when msg property is not present', () => {
        expect(() => {
            errorMiddleware({ error: 'QA_TEST_ERROR' });
        }).not.toThrow();
    });

    it('Should not throw when error property is not present', () => {
        expect(() => {
            errorMiddleware({ msg: 'QA_TEST_MSG' });
        }).not.toThrow();
    });

    it('Should throw when both error and msg properties are present', () => {
        expect(() => {
            errorMiddleware({ error: 'QA_TEST_ERROR', msg: 'QA_TEST_MSG' });
        }).toThrowError(new APIError('QA_TEST_ERROR', 'QA_TEST_MSG'));
    });

    it('Should throw and include params payload if present', () => {
        expect(() => {
            errorMiddleware({
                error: 'QA_TEST_ERROR',
                msg: 'QA_TEST_MSG',
                params: ['first', 'second', 'third']
            });
        }).toThrowError(
            new APIError('QA_TEST_ERROR', 'QA_TEST_MSG', [
                'first',
                'second',
                'third'
            ])
        );
    });
});

export default errorMiddleware;
