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

import Endpoint, { EndpointMethod, ResponseType } from './';

describe('Endpoint base class', () => {
    it('Should correctly serialize route', () => {
        const endpoint = new Endpoint<{ responseParam: 'responseValue' }>({
            method: EndpointMethod.Get,
            route: 'test/route'
        });

        expect(endpoint.method).toBe(EndpointMethod.Get);
        expect(endpoint.responseType).toBe(ResponseType.Json);
        expect(endpoint.route).toBe('test/route');

        const result = endpoint.serialize();

        expect(result).toMatchObject({
            slug: {},
            body: {}
        });
    });

    it('Should handle slugs', () => {
        const endpoint = new Endpoint<{ responseParam: 'responseValue' }>({
            method: EndpointMethod.Get,
            route: 'test/route/{slug}',
            provideSlug: () => ({
                first: 'firstValue',
                second: 'anotherValue'
            })
        });

        const result = endpoint.serialize();
        expect(result).toMatchObject({
            slug: {
                first: 'firstValue',
                second: 'anotherValue'
            },
            body: {}
        });
    });

    it('Should handle parametrized slugs', () => {
        const endpoint = new Endpoint<
            {
                responseParam: 'responseValue';
            },
            { passedSlug: number }
        >({
            method: EndpointMethod.Get,
            route: 'test/route/{slug}',
            provideSlug: request => ({
                first: 'firstValue',
                second: 'anotherValue',
                passedParam: request.passedSlug
            })
        });

        const result = endpoint.serialize({ passedSlug: 4815162342 });
        expect(result).toMatchObject({
            slug: {
                first: 'firstValue',
                second: 'anotherValue',
                passedParam: 4815162342
            },
            body: {}
        });
    });

    it('Should handle request params', () => {
        const endpoint = new Endpoint<
            {
                responseParam: number;
            },
            { passedParam: number }
        >({
            method: EndpointMethod.Get,
            route: 'test/route',
            provideParams: request => ({
                modifiedPassedParam: request.passedParam
            })
        });

        const result = endpoint.serialize({ passedParam: 4815162342 });
        expect(result).toMatchObject({
            slug: {},
            body: {
                modifiedPassedParam: 4815162342
            }
        });
    });

    it('Should provide response', () => {
        const endpoint = new Endpoint<
            {
                multiplied: number;
            },
            { value: number }
        >({
            method: EndpointMethod.Get,
            route: 'test/route',
            provideParams: request => request
        });

        const result = endpoint.serialize({ value: 128 });
        expect(result).toMatchObject({
            slug: {},
            body: {
                value: 128
            }
        });

        expect(result.getResponse(result.body, '')).toMatchObject({
            value: 128
        });
    });

    it('Should transform response', () => {
        const endpoint = new Endpoint<
            {
                multiplied: number;
            },
            { value: number }
        >({
            method: EndpointMethod.Get,
            route: 'test/route',
            provideParams: request => request,
            responseTransformer: response => ({
                multiplied: response.value * 2
            })
        });

        const result = endpoint.serialize({ value: 128 });
        expect(result).toMatchObject({
            slug: {},
            body: {
                value: 128
            }
        });

        expect(result.getResponse(result.body, '')).toMatchObject({
            multiplied: 256
        });
    });

    it('Should combine both response and request in transformer', () => {
        const endpoint = new Endpoint<
            {
                fromResponse: number;
            },
            { fromParams: number }
        >({
            method: EndpointMethod.Get,
            route: 'test/route',
            provideParams: request => request,
            responseTransformer: (response, request) => ({
                ...response,
                ...request,
                multipliedResponse: response.fromResponse * 2,
                multipliedParams: request.fromParams * 2
            })
        });

        const result = endpoint.serialize({ fromParams: 128 });
        expect(result).toMatchObject({
            slug: {},
            body: {
                fromParams: 128
            }
        });

        expect(result.getResponse({ fromResponse: 256 }, '')).toMatchObject({
            fromParams: 128,
            fromResponse: 256,
            multipliedParams: 256,
            multipliedResponse: 512
        });
    });
});
