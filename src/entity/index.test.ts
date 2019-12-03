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

import Entity from './';
import transport from '../__mocks__/transport';
import '../__mocks__/Blob';
import EndpointManager from '../endpointManager';
import Endpoint, { EndpointMethod } from '../endpoint';

describe('Entity', () => {
    class MockEntity extends Entity {
        endpoint = this.bind(
            new Endpoint<any>({
                method: EndpointMethod.Get,
                route: '/route'
            })
        );

        endpointDefaults = this.bindDefaults(
            new Endpoint<any, { hello: string }>({
                method: EndpointMethod.Get,
                route: '/route',
                query: data => data
            }),
            {
                hello: 'world'
            }
        );

        endpointDefaultsNonObject = this.bindDefaults(
            new Endpoint<any, string>({
                method: EndpointMethod.Get,
                route: '/route',
                query: requestValue => ({
                    requestValue
                })
            }),
            'value'
        );

        endpointParams = this.bindParams(
            new Endpoint<any, { hello: string }>({
                method: EndpointMethod.Get,
                route: '/route',
                query: data => data
            }),
            {
                hello: 'world'
            }
        );
    }

    const mockTransport = transport();
    const manager = new EndpointManager('FAKEHOST', {
        transport: mockTransport,
        fullNodes: ['a', 'b', 'c']
    });
    const mockEntity = new MockEntity(manager);

    it('Should bind requests', async () => {
        mockTransport.mockClear();
        mockTransport.pushResponse(__url => ({
            __url,
            hello: 'world'
        }));
        await expect(mockEntity.endpoint()).resolves.toEqual({
            __url: 'FAKEHOST/route',
            hello: 'world'
        });
        expect(mockTransport).toBeCalledTimes(1);

        mockTransport.pushResponse(__url => ({
            __url,
            hello: 'world'
        }));
        await expect(mockEntity.endpoint()).resolves.toEqual({
            __url: 'FAKEHOST/route',
            hello: 'world'
        });
        expect(mockTransport).toBeCalledTimes(2);

        for (let i = 0; i < 3; i++) {
            mockTransport.pushResponse(() => ({
                hello: 'otherValue'
            }));
        }
        await expect(mockEntity.endpoint.multicast()).resolves.toMatchObject({
            count: 3,
            response: {
                hello: 'otherValue'
            }
        });
        expect(mockTransport).toBeCalledTimes(5);
    });

    it('Should bind requests with defaults', async () => {
        mockTransport.mockClear();
        mockTransport.pushResponse(__url => ({
            __url,
            hello: 'world'
        }));
        await expect(mockEntity.endpointDefaults({})).resolves.toEqual({
            __url: 'FAKEHOST/route?hello=world',
            hello: 'world'
        });
        expect(mockTransport).toBeCalledTimes(1);

        mockTransport.pushResponse(__url => ({
            __url,
            hello: 'world'
        }));
        await expect(
            mockEntity.endpointDefaults({ hello: 'othervalue' })
        ).resolves.toEqual({
            __url: 'FAKEHOST/route?hello=othervalue',
            hello: 'world'
        });
        expect(mockTransport).toBeCalledTimes(2);

        for (let i = 0; i < 3; i++) {
            mockTransport.pushResponse(() => ({
                hello: 'otherValue'
            }));
        }
        await expect(
            mockEntity.endpointDefaults.multicast({ hello: 'otherValue' })
        ).resolves.toMatchObject({
            count: 3,
            response: {
                hello: 'otherValue'
            }
        });
        expect(mockTransport).toBeCalledTimes(5);
    });

    it('Should bind requests with defaults of non object type', async () => {
        mockTransport.mockClear();
        mockTransport.pushResponse(__url => ({
            __url,
            hello: 'world'
        }));

        await expect(
            mockEntity.endpointDefaultsNonObject('QA_TEST_VALUE')
        ).resolves.toEqual({
            __url: 'FAKEHOST/route?requestValue=QA_TEST_VALUE',
            hello: 'world'
        });
        expect(mockTransport).toBeCalledTimes(1);

        mockTransport.pushResponse(__url => ({
            __url,
            hello: 'world'
        }));

        await expect(
            mockEntity.endpointDefaultsNonObject(undefined!)
        ).resolves.toEqual({
            __url: 'FAKEHOST/route?requestValue=value',
            hello: 'world'
        });
        expect(mockTransport).toBeCalledTimes(2);
    });

    it('Should bind requests with params', async () => {
        mockTransport.mockClear();

        mockTransport.pushResponse(__url => ({
            __url,
            hello: 'world'
        }));
        await expect(mockEntity.endpointParams()).resolves.toEqual({
            __url: 'FAKEHOST/route?hello=world',
            hello: 'world'
        });
        expect(mockTransport).toBeCalledTimes(1);

        mockTransport.pushResponse(__url => ({
            __url,
            hello: 'world'
        }));
        await expect(
            (mockEntity.endpointParams as any)({ hello: 'othervalue' })
        ).resolves.toEqual({
            __url: 'FAKEHOST/route?hello=world',
            hello: 'world'
        });
        expect(mockTransport).toBeCalledTimes(2);

        for (let i = 0; i < 3; i++) {
            mockTransport.pushResponse(() => ({
                hello: 'otherValue'
            }));
        }
        await expect(
            mockEntity.endpointParams.multicast()
        ).resolves.toMatchObject({
            count: 3,
            response: {
                hello: 'otherValue'
            }
        });
        expect(mockTransport).toBeCalledTimes(5);
    });
});
