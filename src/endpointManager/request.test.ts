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

import request from './request';
import Endpoint, { EndpointMethod, ResponseType } from '../endpoint';
import transport from '../__mocks__/transport';
import '../__mocks__/Blob';
import bodySerializer from './serializers/bodySerializer';
import {
    InvalidResponseTypeError,
    ResponseError,
    NetworkError
} from '../types/error';

describe('Request', () => {
    it('Should handle serialization', async () => {
        const mockTransport = transport();

        mockTransport.pushResponse((__url, data) => ({
            __url,
            ...data
        }));

        const response = await request({
            apiHost: 'fakehost',
            transport: mockTransport,
            endpoint: new Endpoint<any, any>({
                responseType: ResponseType.Json,
                method: EndpointMethod.Post,
                route: '/route/{slug}/',
                slug: data => data,
                query: data => ({
                    first: data.first,
                    second: data.second,
                    third: data.third
                }),
                body: data => ({
                    first: data.first,
                    second: data.second,
                    third: data.third
                })
            }),
            params: {
                first: 'hello',
                second: true,
                third: 128,
                slug: 'testSlug'
            }
        });

        expect(mockTransport).toBeCalledTimes(1);
        expect(response).toMatchObject({
            __url: 'fakehost/route/testSlug?first=hello&second=true&third=128',
            body: bodySerializer({
                first: 'hello',
                second: true,
                third: 128
            })
        });
    });

    it('Should throw when response type is invalid', async () => {
        const mockTransport = transport();
        mockTransport.pushResponse((__url, data) => ({
            __url,
            ...data
        }));

        await expect(
            request({
                apiHost: 'fakehost',
                transport: mockTransport,
                endpoint: new Endpoint<any, any>({
                    responseType: 'test' as any,
                    method: EndpointMethod.Post,
                    route: '/route/{slug}/'
                }),
                params: {}
            })
        ).rejects.toEqual(new InvalidResponseTypeError('test'));
        expect(mockTransport).toBeCalledTimes(1);
    });

    it('Should handle text responses', async () => {
        const mockTransport = transport();
        mockTransport.pushResponse(__url => ({
            __url,
            hello: 'world'
        }));

        await expect(
            request({
                apiHost: 'fakehost',
                transport: mockTransport,
                endpoint: new Endpoint<any, any>({
                    responseType: ResponseType.PlainText,
                    method: EndpointMethod.Get,
                    route: '/route',
                    response: (_json, _params, plainText) => plainText
                }),
                params: {}
            })
        ).resolves.toEqual(
            JSON.stringify({
                __url: 'fakehost/route',
                hello: 'world'
            })
        );
        expect(mockTransport).toBeCalledTimes(1);
    });

    it('Should handle both responses', async () => {
        const mockTransport = transport();
        mockTransport.pushResponse(__url => ({
            __url,
            hello: 'world'
        }));

        await expect(
            request({
                apiHost: 'fakehost',
                transport: mockTransport,
                endpoint: new Endpoint<any, any>({
                    responseType: ResponseType.Both,
                    method: EndpointMethod.Get,
                    route: '/route',
                    response: (json, _params, plainText) => ({
                        ...json,
                        plainText
                    })
                }),
                params: {}
            })
        ).resolves.toEqual({
            __url: 'fakehost/route',
            hello: 'world',
            plainText: JSON.stringify({
                __url: 'fakehost/route',
                hello: 'world'
            })
        });
        expect(mockTransport).toBeCalledTimes(1);
    });

    it('Should handle erroneous responses', async () => {
        const mockTransport = transport();
        mockTransport.pushResponse(
            () => ({
                status: 100,
                statusText: 'QA_RESPONSE_ERROR'
            }),
            false
        );

        await expect(
            request({
                apiHost: 'fakehost',
                transport: mockTransport,
                endpoint: new Endpoint<any, any>({
                    responseType: ResponseType.Json,
                    method: EndpointMethod.Get,
                    route: '/route'
                }),
                params: {}
            })
        ).rejects.toEqual(new ResponseError(100, 'QA_RESPONSE_ERROR'));
        expect(mockTransport).toBeCalledTimes(1);
    });

    it('Should handle faulty transport / connection error', async () => {
        await expect(
            request({
                apiHost: 'fakehost',
                transport: () => {
                    throw 'E_BAD_TRANSPORT';
                },
                endpoint: new Endpoint<any, any>({
                    responseType: ResponseType.Json,
                    method: EndpointMethod.Get,
                    route: '/route'
                }),
                params: {}
            })
        ).rejects.toEqual(new NetworkError('E_BAD_TRANSPORT'));
    });
});
