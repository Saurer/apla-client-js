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

import FullNode from './FullNode';
import Network from './Network';
import EndpointManager from '../endpointManager';
import transport from '../__mocks__/transport';

class CentrifugeMock {
    private _callbacks: { [event: string]: () => void } = {};

    setToken() {
        /* nop */
    }
    on(event: 'connect' | 'error', callback: () => void) {
        this._callbacks[event] = callback;
    }
    connect() {
        setTimeout(() => {
            this._callbacks.connect?.();
        }, 500);
    }
}

describe('FullNode', () => {
    const mockNetwork = jest.genMockFromModule<Network>('./Network');
    const mockTransport = transport();
    const endpointManager = new EndpointManager('FAKEHOST', {
        fullNodes: [],
        transport: mockTransport
    });
    const mockParams = {
        apiAddress: 'test_api',
        tcpAddress: 'test_tcp'
    };

    it('Should return network that created instance', () => {
        const fullNode = new FullNode(endpointManager, mockNetwork, mockParams);
        expect(fullNode.network).toBe(mockNetwork);
    });

    it('Should return api address', () => {
        const fullNode = new FullNode(endpointManager, mockNetwork, mockParams);
        expect(fullNode.apiAddress).toBe(mockParams.apiAddress);
    });

    it('Should return tcp address', async () => {
        const fullNode = new FullNode(endpointManager, mockNetwork, mockParams);
        expect(fullNode.tcpAddress).toBe(mockParams.tcpAddress);
    });

    it('Should return node connection', async () => {
        mockTransport.pushResponse(() => 'QA_TEST_WEBSOCKET');

        jest.resetModuleRegistry();
        jest.mock('centrifuge', () => CentrifugeMock);
        const JestFullNode = jest.requireActual('./FullNode');
        const fullNode = new JestFullNode.default(
            endpointManager,
            mockNetwork,
            mockParams
        );
        const node = await fullNode.connect();
        expect(node.fullNode).toBe(fullNode);
    });
});
