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

describe('Endpoint manager', () => {
    it('Should return options', () => {
        const mockTransport = transport();
        const instance = new EndpointManager('FAKEHOST', {
            transport: mockTransport,
            fullNodes: ['QA_API_ADDRESS']
        });

        expect(instance.options).toEqual({
            transport: mockTransport,
            fullNodes: ['QA_API_ADDRESS']
        });
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
});
