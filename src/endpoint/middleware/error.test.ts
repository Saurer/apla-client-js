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
