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
import Node from './Node';
import EndpointManager from '../endpointManager';
import Metrics from './Metrics';
import transport from '../__mocks__/transport';
import '../__mocks__/Blob';
import Account from './Account';

describe('Node', () => {
    const mockNetwork = jest.genMockFromModule<Network>('./Network');
    const mockTransport = transport();
    const endpointManager = new EndpointManager('FAKEHOST', {
        fullNodes: [],
        transport: mockTransport
    });
    const mockFullNode = new FullNode(endpointManager, mockNetwork, {
        tcpAddress: 'test_tcp',
        apiAddress: 'test_api'
    });

    async function testEndpoint(
        call: (node: Node) => Promise<any>,
        response: any,
        expectFn: (param: jest.Matchers<Promise<any>>) => Promise<any>
    ) {
        mockTransport.mockClear();
        const node = new Node(endpointManager, mockFullNode);

        mockTransport.pushResponse(() => response);

        await expectFn(expect(call(node)));
        expect(mockTransport).toBeCalledTimes(1);
    }

    it('Should return network that created instance', () => {
        const node = new Node(endpointManager, mockFullNode);
        expect(node.network).toBe(mockNetwork);
    });

    it('Should return fullnode that created instance', () => {
        const node = new Node(endpointManager, mockFullNode);
        expect(node.fullNode).toBe(mockFullNode);
    });

    it('Should provide metrics', () => {
        const node = new Node(endpointManager, mockFullNode);
        expect(node.metrics).toBeInstanceOf(Metrics);
    });

    it('Should return version', async () => {
        await testEndpoint(
            node => node.getVersion(),
            'v1.3.3.7',
            value => value.resolves.toBe('v1.3.3.7')
        );
    });

    it('Should return maxBlockID', async () => {
        await testEndpoint(
            node => node.getMaxBlockID(),
            {
                max_block_id: 128
            },
            value => value.resolves.toBe(128)
        );
    });

    it('Should return content hash', async () => {
        await testEndpoint(
            node =>
                node.getContentHash({
                    name: 'QA_NAME',
                    ecosystemID: 'QA_ECOSYSTEM_ID',
                    keyID: 'QA_KEY_ID',
                    roleID: 'QA_ROLE_ID',
                    params: {
                        QA_TEST_PARAM: 'QA_TEST_VALUE'
                    }
                }),
            { hash: '1024' },
            value => value.resolves.toBe('1024')
        );
    });

    it('Should return account info', async () => {
        await testEndpoint(
            node => node.getAccountInfo('QA_TEST_ID'),
            {
                account: 'QA_TEST_ACCOUNT',
                ecosystems: []
            },
            value =>
                value.resolves.toEqual({
                    keyID: 'QA_TEST_ID',
                    account: 'QA_TEST_ACCOUNT',
                    ecosystems: []
                })
        );
    });

    it('Should return blocks', async () => {
        await testEndpoint(
            node =>
                node.getBlocks({
                    id: '64',
                    count: 128
                }),
            {
                hash: 'QA_TEST_HASH',
                contract_name: 'QA_TEST_CONTRACT',
                key_id: 100,
                params: null
            },
            value =>
                value.resolves.toEqual({
                    hash: 'QA_TEST_HASH',
                    contract_name: 'QA_TEST_CONTRACT',
                    key_id: 100,
                    params: null
                })
        );
    });

    it('Should return detailed blocks', async () => {
        await testEndpoint(
            node =>
                node.getBlocksDetailed({
                    id: '128',
                    count: 64
                }),
            {
                1: {
                    header: {
                        block_id: 1,
                        time: 2,
                        key_id: 3,
                        node_position: 4,
                        version: 5
                    },
                    hash: 'QA_HASH',
                    node_position: 6,
                    key_id: 7,
                    time: 8,
                    tx_count: 9,
                    rollbacks_hash: 'QA_HASH',
                    mrkl_root: 'QA_MRKL_ROOT',
                    stop_count: 10,
                    transactions: []
                }
            },
            value =>
                value.resolves.toEqual({
                    1: {
                        header: {
                            block_id: 1,
                            time: 2,
                            key_id: 3,
                            node_position: 4,
                            version: 5
                        },
                        hash: 'QA_HASH',
                        node_position: 6,
                        key_id: 7,
                        time: 8,
                        tx_count: 9,
                        rollbacks_hash: 'QA_HASH',
                        mrkl_root: 'QA_MRKL_ROOT',
                        stop_count: 10,
                        transactions: []
                    }
                })
        );
    });

    it('Should return ecosystem name', async () => {
        await testEndpoint(
            node => node.getEcosystemName('128'),
            {
                ecosystem_name: 'QA_ECOSYSTEM_NAME'
            },
            value => value.resolves.toBe('QA_ECOSYSTEM_NAME')
        );
    });

    it('Should return page validators count', async () => {
        await testEndpoint(
            node => node.getPageValidatorsCount('QA_TEST_PAGE'),
            {
                validate_count: 8
            },
            value => value.resolves.toBe(8)
        );
    });

    it('Should return account', async () => {
        mockTransport.mockClear();
        const node = new Node(endpointManager, mockFullNode);

        mockTransport.pushResponse(() => ({
            account: 'QA_TEST_ACCOUNT',
            ecosystems: [
                {
                    id: 'QA_TEST_ECOSYSTEM_ID',
                    name: 'QA_TEST_ECOSYSTEM_NAME',
                    roles: [],
                    notifications: []
                }
            ]
        }));

        const account = await node.getAccount('QA_TEST_KEY_ID');
        expect(account).toBeInstanceOf(Account);
        expect(account.node).toBe(node);
        expect(mockTransport).toBeCalledTimes(1);
    });
});
