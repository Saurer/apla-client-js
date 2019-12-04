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

import EndpointManager from './';
import transport from '../__mocks__/transport';
import '../__mocks__/Blob';
import Endpoint, { EndpointMethod } from '../endpoint';
import { defaultKey } from '../';
import crypto from '../crypto';
import { toUint8Array, hexToUint8Array } from '../convert';

describe('Endpoint manager', () => {
    it('Should return options', () => {
        const mockTransport = transport();
        const instance = new EndpointManager('FAKEHOST', {
            transport: mockTransport,
            fullNodes: ['QA_API_ADDRESS'],
            apiToken: '4815162342'
        });

        expect(instance.options).toEqual({
            transport: mockTransport,
            fullNodes: ['QA_API_ADDRESS'],
            apiToken: '4815162342'
        });
    });

    it('Should return if elevated', () => {
        const mockTransport = transport();
        const instance = new EndpointManager('FAKEHOST', {
            transport: mockTransport,
            fullNodes: ['QA_API_ADDRESS'],
            apiToken: '4815162342'
        });

        expect(instance.isElevated).toBe(true);
    });

    it('Should reroute to node', () => {
        const mockTransport = transport();
        const instance = new EndpointManager('FAKEHOST', {
            transport: mockTransport,
            fullNodes: ['QA_API_ADDRESS']
        });

        const value = instance.to('OTHER_FAKE_HOST');
        expect(value).toHaveProperty('_apiHost', 'OTHER_FAKE_HOST');
        expect(value.options).toEqual({
            transport: mockTransport,
            fullNodes: ['QA_API_ADDRESS']
        });
    });

    it('Should execute requests', async () => {
        const mockTransport = transport();
        const instance = new EndpointManager('FAKEHOST', {
            transport: mockTransport,
            fullNodes: []
        });

        mockTransport.pushResponse(__url => ({
            __url,
            hello: 'world'
        }));

        await expect(
            instance.request(
                new Endpoint<any, any>({
                    method: EndpointMethod.Get,
                    route: '/route',
                    query: data => data
                }),
                {
                    hello: 'world'
                }
            )
        ).resolves.toEqual({
            __url: 'FAKEHOST/route?hello=world',
            hello: 'world'
        });
        expect(mockTransport).toBeCalledTimes(1);
    });

    it('Should execute valid multicast requests', async () => {
        const mockTransport = transport();
        const instance = new EndpointManager('FAKEHOST', {
            transport: mockTransport,
            fullNodes: [
                'FAKEHOST',
                'FAKEHOST',
                'FAKEHOST',
                'FAKEHOST',
                'FAKEHOST',
                'FAKEHOST',
                'FAKEHOST',
                'FAKEHOST',
                'FAKEHOST',
                'FAKEHOST'
            ]
        });

        for (let i = 0; i < 5; i++) {
            mockTransport.pushResponse(__url => ({
                __url,
                a: 'test',
                b: 64,
                c: true
            }));
        }

        await expect(
            instance.multicast(
                new Endpoint<any, any>({
                    method: EndpointMethod.Get,
                    route: '/route',
                    query: data => data
                }),
                {
                    hello: 'world'
                }
            )
        ).resolves.toMatchObject({
            count: 3,
            response: {
                __url: 'FAKEHOST/route?hello=world',
                a: 'test',
                b: 64,
                c: true
            }
        });
        expect(mockTransport.mock.calls.length).toBeGreaterThanOrEqual(3);
    });

    it('Should pass on nodes that return error when performing multicast requests', async () => {
        const mockTransport = transport();
        const instance = new EndpointManager('FAKEHOST', {
            transport: mockTransport,
            fullNodes: [
                'FAKEHOST',
                'FAKEHOST',
                'FAKEHOST',
                'FAKEHOST',
                'FAKEHOST',
                'FAKEHOST',
                'FAKEHOST',
                'FAKEHOST',
                'FAKEHOST',
                'FAKEHOST'
            ]
        });

        for (let i = 0; i < 5; i++) {
            mockTransport.pushResponse(
                __url => ({
                    __url,
                    a: 'test',
                    b: 64,
                    c: true
                }),
                i < 2 || i === 4
            );
        }

        await expect(
            instance.multicast(
                new Endpoint<any, any>({
                    method: EndpointMethod.Get,
                    route: '/route',
                    query: data => data
                }),
                {
                    hello: 'world'
                }
            )
        ).resolves.toMatchObject({
            count: 3,
            response: {
                __url: 'FAKEHOST/route?hello=world',
                a: 'test',
                b: 64,
                c: true
            }
        });
        expect(mockTransport.mock.calls.length).toBeGreaterThanOrEqual(3);
    });

    it('Should login correctly', async () => {
        const mockTransport = transport();
        const instance = new EndpointManager('FAKEHOST', {
            transport: mockTransport,
            fullNodes: []
        });
        const uidSalt = 'LOGIN';
        const networkID = '1200';
        const uid = '4815162342';

        mockTransport.pushResponse(async (_url, request) => {
            const ecosystem = request.body.get('ecosystem');
            const pubkey = request.body.get('pubkey');
            const signature = request.body.get('signature');
            const sigBytes = hexToUint8Array(signature);
            const sigMsg = await toUint8Array(`${uidSalt}${networkID}${uid}`);
            const result = await crypto.verify(sigBytes, sigMsg, pubkey);

            if (result) {
                return {
                    token: 'QA_TEST_ELEVATED_TOKEN',
                    ecosystem_id: ecosystem,
                    key_id: 'QA_KEY_ID',
                    account: 'QA_ACCOUNT',
                    notify_key: 'QA_NOTIFY_KEY',
                    isnode: false,
                    isowner: true,
                    timestamp: '1234'
                };
            } else {
                throw 'E_INVALID_SIG';
            }
        });

        mockTransport.pushResponse(() => ({
            token: 'QA_TEST_TOKEN',
            network_id: networkID,
            uid
        }));

        await expect(
            instance.login(defaultKey, {
                ecosystemID: '2',
                expiry: 120000,
                isMobile: true
            })
        ).resolves.not.toThrow();
    });
});
