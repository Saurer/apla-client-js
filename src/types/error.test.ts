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

import { NetworkError, RetryExceededError } from './error';

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
            name: 'E_NETWORK_ERROR',
            message: 'test',
            baseError: genericError
        });
    });

    it('Should handle unknown types', () => {
        const networkError = new NetworkError(64);

        expect(networkError).toMatchObject({
            name: 'E_NETWORK_ERROR',
            message: 'Unknown error',
            baseError: 64
        });
    });

    it('Should handle retry exceeded error', () => {
        const error = new RetryExceededError();

        expect(error).toMatchObject({
            name: 'E_RETRY_EXCEEDED',
            message: 'Retry count exceeded'
        });
    });
});
