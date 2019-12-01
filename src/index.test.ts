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

import { MissingTransportError } from './types/error';

describe('Base API', () => {
    it('Should use fetch if available', async () => {
        const anyGlobal = global as any;
        const mockFetch = jest.fn();
        const { connect } = jest.requireActual('./index');

        anyGlobal.window = {
            fetch: mockFetch
        };

        await expect(
            connect({
                fullNodes: ['a', 'b', 'c']
            })
        ).rejects.not.toEqual(new MissingTransportError());
        expect(mockFetch).toBeCalledTimes(3);
    });

    it('Should throw if fetch is unavailable', async () => {
        const { connect } = jest.requireActual('./index');
        const anyGlobal = global as any;
        delete anyGlobal.window;

        await expect(
            connect({
                fullNodes: ['a', 'b', 'c']
            })
        ).rejects.toEqual(new MissingTransportError());
    });

    it('Should override transport if specified', async () => {
        const anyGlobal = global as any;
        const mockFetch = jest.fn();
        const mockTransport = jest.fn();
        const { connect } = jest.requireActual('./index');

        anyGlobal.window = {
            fetch: mockFetch
        };

        await expect(
            connect({
                fullNodes: ['a', 'b', 'c'],
                transport: mockTransport
            })
        ).rejects.not.toEqual(new MissingTransportError());

        expect(mockFetch).not.toBeCalled();
        expect(mockTransport).toBeCalledTimes(3);
    });
});
