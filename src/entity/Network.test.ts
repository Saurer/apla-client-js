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

import Network from './Network';
import transport from '../__mocks__/transport';
import { UnalignedNetworkError } from '../types/error';

describe('Network', () => {
    it('Should connect to a network with synced nodes', async () => {
        const mockTransport = transport();

        for (let i = 0; i < 3; i++) {
            mockTransport.pushResponse(() => ({
                network_ud: '1',
                centrifugo_url: '',
                test: true,
                full_nodes: [
                    {
                        tcp_address: '',
                        api_address: 'FAKEDOMAIN',
                        key_id: '',
                        public_key: '',
                        unban_time: '',
                        stopped: false
                    },
                    {
                        tcp_address: '',
                        api_address: 'FAKEDOMAIN2',
                        key_id: '',
                        public_key: '',
                        unban_time: '',
                        stopped: false
                    },
                    {
                        tcp_address: '',
                        api_address: 'FAKEDOMAIN3',
                        key_id: '',
                        public_key: '',
                        unban_time: '',
                        stopped: false
                    }
                ]
            }));
        }

        await expect(
            Network.connect({
                fullNodes: ['FAKEDOMAIN', 'FAKEDOMAIN', 'FAKEDOMAIN'],
                transport: mockTransport
            })
        ).resolves.toBeInstanceOf(Network);
        expect(mockTransport.mock.calls.length).toBeGreaterThanOrEqual(3);
    });

    it('Should connect to a network with stopped nodes', async () => {
        const mockTransport = transport();

        for (let i = 0; i < 3; i++) {
            mockTransport.pushResponse(() => ({
                network_ud: '1',
                centrifugo_url: '',
                test: true,
                full_nodes: [
                    {
                        tcp_address: '',
                        api_address: 'FAKEDOMAIN',
                        key_id: '',
                        public_key: '',
                        unban_time: '',
                        stopped: false
                    },
                    {
                        tcp_address: '',
                        api_address: 'FAKEDOMAIN2',
                        key_id: '',
                        public_key: '',
                        unban_time: '',
                        stopped: true
                    },
                    {
                        tcp_address: '',
                        api_address: 'FAKEDOMAIN3',
                        key_id: '',
                        public_key: '',
                        unban_time: '',
                        stopped: true
                    }
                ]
            }));
        }

        await expect(
            Network.connect({
                fullNodes: ['FAKEDOMAIN', 'FAKEDOMAIN', 'FAKEDOMAIN'],
                transport: mockTransport
            })
        ).resolves.toBeInstanceOf(Network);
        expect(mockTransport.mock.calls.length).toBeGreaterThanOrEqual(3);
    });

    it('Should connect if certain nodes are unavailable', async () => {
        const mockTransport = transport();

        for (let i = 0; i < 10; i++) {
            mockTransport.pushResponse(
                () => ({
                    network_ud: '1',
                    centrifugo_url: '',
                    test: true,
                    full_nodes: [
                        {
                            tcp_address: '',
                            api_address: 'FAKEDOMAIN',
                            key_id: '',
                            public_key: '',
                            unban_time: '',
                            stopped: false
                        },
                        {
                            tcp_address: '',
                            api_address: 'FAKEDOMAIN2',
                            key_id: '',
                            public_key: '',
                            unban_time: '',
                            stopped: false
                        },
                        {
                            tcp_address: '',
                            api_address: 'FAKEDOMAIN3',
                            key_id: '',
                            public_key: '',
                            unban_time: '',
                            stopped: false
                        }
                    ]
                }),
                i > 5
            );
        }

        await expect(
            Network.connect({
                fullNodes: [
                    'FAKEDOMAIN',
                    'FAKEDOMAIN',
                    'FAKEDOMAIN',
                    'FAKEDOMAIN',
                    'FAKEDOMAIN',
                    'FAKEDOMAIN',
                    'FAKEDOMAIN',
                    'FAKEDOMAIN',
                    'FAKEDOMAIN',
                    'FAKEDOMAIN'
                ],
                transport: mockTransport
            })
        ).resolves.toBeInstanceOf(Network);
        expect(mockTransport.mock.calls.length).toBeGreaterThanOrEqual(5);
    });

    it('Should not connect to a network with full_nodes difference', async () => {
        const mockTransport = transport();

        for (let i = 0; i < 2; i++) {
            mockTransport.pushResponse(() => ({
                network_ud: '1',
                centrifugo_url: '',
                test: true,
                full_nodes: [
                    {
                        tcp_address: '',
                        api_address: 'FAKEDOMAIN',
                        key_id: '',
                        public_key: '',
                        unban_time: '',
                        stopped: false
                    },
                    {
                        tcp_address: '',
                        api_address: 'FAKEDOMAIN2',
                        key_id: '',
                        public_key: '',
                        unban_time: '',
                        stopped: true
                    },
                    {
                        tcp_address: '',
                        api_address: 'FAKEDOMAIN3',
                        key_id: '',
                        public_key: '',
                        unban_time: '',
                        stopped: true
                    }
                ]
            }));
        }

        mockTransport.pushResponse(() => ({
            network_ud: '1',
            centrifugo_url: '',
            test: true,
            full_nodes: [
                {
                    tcp_address: '',
                    api_address: 'FAKEDOMAIN4',
                    key_id: '',
                    public_key: '',
                    unban_time: '',
                    stopped: false
                },
                {
                    tcp_address: '',
                    api_address: 'FAKEDOMAIN2',
                    key_id: '',
                    public_key: '',
                    unban_time: '',
                    stopped: true
                },
                {
                    tcp_address: '',
                    api_address: 'FAKEDOMAIN3',
                    key_id: '',
                    public_key: '',
                    unban_time: '',
                    stopped: true
                }
            ]
        }));

        await expect(
            Network.connect({
                fullNodes: ['FAKEDOMAIN', 'FAKEDOMAIN', 'FAKEDOMAIN'],
                transport: mockTransport
            })
        ).rejects.toBeInstanceOf(UnalignedNetworkError);
        expect(mockTransport.mock.calls.length).toBeGreaterThanOrEqual(3);
    });
});
