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

import Node from './Node';
import Metrics from './Metrics';
import EndpointManager from '../endpointManager';
import transport from '../__mocks__/transport';

describe('Metrics', () => {
    const mockNode = jest.genMockFromModule<Node>('./Node');
    const mockTransport = transport();
    const endpointManager = new EndpointManager('FAKEHOST', {
        fullNodes: [],
        transport: mockTransport
    });

    it('Should return node that created instance', () => {
        const metrics = new Metrics(endpointManager, mockNode);
        expect(metrics.node).toBe(mockNode);
    });

    it('Should return keys', async () => {
        mockTransport.mockClear();
        const metrics = new Metrics(endpointManager, mockNode);

        mockTransport.pushResponse(() => ({
            count: 8
        }));

        await expect(metrics.keys()).resolves.toBe(8);
        expect(mockTransport).toBeCalledTimes(1);
    });

    it('Should return blocks', async () => {
        mockTransport.mockClear();
        const metrics = new Metrics(endpointManager, mockNode);

        mockTransport.pushResponse(() => ({
            count: 16
        }));

        await expect(metrics.blocks()).resolves.toBe(16);
        expect(mockTransport).toBeCalledTimes(1);
    });

    it('Should return fullnodes', async () => {
        mockTransport.mockClear();
        const metrics = new Metrics(endpointManager, mockNode);

        mockTransport.pushResponse(() => ({
            count: 32
        }));

        await expect(metrics.fullNodes()).resolves.toBe(32);
        expect(mockTransport).toBeCalledTimes(1);
    });

    it('Should return ecosystems', async () => {
        mockTransport.mockClear();
        const metrics = new Metrics(endpointManager, mockNode);

        mockTransport.pushResponse(() => ({
            count: 64
        }));

        await expect(metrics.ecosystems()).resolves.toBe(64);
        expect(mockTransport).toBeCalledTimes(1);
    });

    it('Should return transactions', async () => {
        mockTransport.mockClear();
        const metrics = new Metrics(endpointManager, mockNode);

        mockTransport.pushResponse(() => ({
            count: 128
        }));

        await expect(metrics.transactions()).resolves.toBe(128);
        expect(mockTransport).toBeCalledTimes(1);
    });

    it('Should return memory', async () => {
        mockTransport.mockClear();
        const metrics = new Metrics(endpointManager, mockNode);

        mockTransport.pushResponse(() => ({
            alloc: 256,
            sys: 512
        }));

        await expect(metrics.memory()).resolves.toEqual({
            alloc: 256,
            sys: 512
        });
        expect(mockTransport).toBeCalledTimes(1);
    });
});
