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

import AplaClient from '../client/AplaClient';
import ContractService from './ContractService';
import { Contract } from '..';
import { SerializedTransaction } from '../types/tx';
import { RetryExceededError } from '../types/error';

const DEFAULT_KEY =
    'e5a87a96a445cb55a214edaad3661018061ef2936e63a0a93bdb76eb28251c1f';
const TX_STATUS_TIMEOUT = 1500;
const TX_STATUS_RETRIES = 3;

class MockAplaClient extends AplaClient {
    private _statusHook = {};

    getRow: any = async (params: { value: string }) =>
        '128' === params.value
            ? {
                  id: params.value,
                  name: 'QA_TEST_CONTRACT'
              }
            : null;

    getContract: any = async (params: { name: string }) =>
        'QA_TEST_CONTRACT' === params.name
            ? {
                  id: '128',
                  ecosystemID: '1',
                  name: params.name,
                  tableID: '128',
                  keyID: '',
                  tokenID: '',
                  address: '',
                  fields: [
                      {
                          type: 'int' as const,
                          name: 'firstField',
                          optional: false
                      },
                      {
                          type: 'bool' as const,
                          name: 'secondField',
                          optional: false
                      },
                      {
                          type: 'money' as const,
                          name: 'thirdField',
                          optional: false
                      }
                  ]
              }
            : null;

    txExec: any = async (contracts: SerializedTransaction[]) => {
        contracts.forEach((contract, index) => {
            this._statusHook[contract.hash] = {
                current: 0,
                count: index + 1
            };
        });
        return Object.keys(contracts);
    };

    txStatus: any = async (hashes: string[]) => {
        return hashes.reduce((acc, value) => {
            const status = this._statusHook[value];
            if (status.current++ >= status.count) {
                acc[value] = {
                    blockid: String(status.count)
                };
            } else {
                acc[value] = {};
            }

            return acc;
        }, {});
    };
}

const mockService = new ContractService(
    new MockAplaClient('QA_TEST_HOST') as AplaClient,
    {
        statusRetryTimeout: TX_STATUS_TIMEOUT,
        statusMaxRetries: TX_STATUS_RETRIES,
        session: {
            networkID: 128,
            token: 'QA_TEST_TOKEN',
            ecosystem: '1'
        }
    }
);

describe('ContractService', () => {
    it('Should get contract by name', async () => {
        await expect(mockService.fromName('QA_TEST_CONTRACT')).resolves.toEqual(
            new Contract({
                id: 128,
                ecosystemID: 1,
                networkID: 128,
                fields: {
                    firstField: 'int',
                    secondField: 'bool',
                    thirdField: 'money'
                }
            })
        );
    });

    it('Should get contract by ID', async () => {
        await expect(mockService.fromID('128')).resolves.toEqual(
            new Contract({
                id: 128,
                ecosystemID: 1,
                networkID: 128,
                fields: {
                    firstField: 'int',
                    secondField: 'bool',
                    thirdField: 'money'
                }
            })
        );
    });

    it('Should not throw if nothing found', async () => {
        await expect(mockService.fromID('-1')).resolves.toBe(null);
        await expect(mockService.fromName('NON_EXISTENT')).resolves.toBe(null);
    });

    it('Should execute batched contracts', async () => {
        Date.now = () => 1;
        jest.setTimeout(TX_STATUS_TIMEOUT * (TX_STATUS_RETRIES + 1));
        const result = await mockService.executeBatch(
            [1, 2].map(
                id => ({
                    contract: new Contract({
                        id,
                        ecosystemID: 1,
                        networkID: 1,
                        fields: {}
                    }),
                    params: {}
                }),
                DEFAULT_KEY
            ),
            DEFAULT_KEY
        );

        expect(result).toEqual([
            {
                blockid: '1',
                hash:
                    'EE011F57D7EC25C89F88B5EEFCF32F93BC06FF2A13EEB6BCCD81A020B8C4A8DD'
            },
            {
                blockid: '2',
                hash:
                    '311C5B1E28F5FDEA2795F40FC1BB2AC02B0D760749AFA3F9407923DEF6FF1FD1'
            }
        ]);
    });

    it('Should execute single contract', async () => {
        Date.now = () => 1;
        jest.setTimeout(TX_STATUS_TIMEOUT * (TX_STATUS_RETRIES + 1));
        const result = await mockService.execute(
            new Contract({
                id: 1,
                ecosystemID: 1,
                networkID: 1,
                fields: {}
            }),
            {},
            DEFAULT_KEY
        );

        expect(result).toEqual({
            blockid: '1',
            hash:
                'EE011F57D7EC25C89F88B5EEFCF32F93BC06FF2A13EEB6BCCD81A020B8C4A8DD'
        });
    });

    it('Should resolve when status returned error', async () => {
        jest.setTimeout(30000);

        class MockErrorClient extends MockAplaClient {
            private _attempt = 0;

            txStatus: any = async (hashes: string[]) =>
                hashes.reduce((acc, value) => {
                    acc[value] =
                        this._attempt++ > 2
                            ? {
                                  errmsg: 'Failed'
                              }
                            : {};
                    return acc;
                }, {});
        }

        const client = new MockErrorClient('');
        const service = new ContractService(client, {
            session: {
                networkID: 128,
                token: 'QA_TEST_TOKEN',
                ecosystem: '1'
            }
        });

        const result = await service.execute(
            new Contract({
                id: 1,
                ecosystemID: 1,
                networkID: 1,
                fields: {}
            }),
            {},
            DEFAULT_KEY
        );

        expect('blockid' in result).toBeFalsy();
        expect(result).toMatchObject({
            errmsg: 'Failed'
        });
    });

    it('Should time out', async () => {
        class MockPendingClient extends MockAplaClient {
            txStatus: any = async (hashes: string[]) =>
                hashes.reduce((acc, value) => {
                    acc[value] = {};
                    return acc;
                }, {});
        }

        const client = new MockPendingClient('');
        const service = new ContractService(client, {
            statusRetryTimeout: 100,
            statusMaxRetries: 5,
            session: {
                networkID: 128,
                token: 'QA_TEST_TOKEN',
                ecosystem: '1'
            }
        });

        await expect(
            service.execute(
                new Contract({
                    id: 1,
                    ecosystemID: 1,
                    networkID: 1,
                    fields: {}
                }),
                {},
                DEFAULT_KEY
            )
        ).rejects.toEqual(new RetryExceededError());
    });

    it('Should make immediate calls', async () => {
        jest.setTimeout(3000);

        class MockInstantClient extends MockAplaClient {
            txStatus: any = (hashes: string[]) =>
                hashes.reduce((acc, value) => {
                    acc[value] = {
                        blockid: '1'
                    };
                    return acc;
                }, {});
        }

        const service = new ContractService(new MockInstantClient(''), {
            statusRetryTimeout: 30000,
            statusMaxRetries: 5,
            statusImmediate: true,
            session: {
                networkID: 128,
                token: 'QA_TEST_TOKEN',
                ecosystem: '1'
            }
        });

        await expect(
            service.execute(
                new Contract({
                    id: 1,
                    ecosystemID: 1,
                    networkID: 1,
                    fields: {}
                }),
                {},
                DEFAULT_KEY
            )
        ).resolves.toMatchObject({
            blockid: '1'
        });
    });
});
