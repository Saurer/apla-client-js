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

import Client, { RequestTransport } from './Client';
import Endpoint, { EndpointMethod, ResponseType } from '../endpoint';
import { NetworkError } from '../types/error';

const testEndpoint = new Endpoint({
    route: 'getTest',
    method: EndpointMethod.Get
});

const passThroughEndpointGet = new Endpoint<any, any>({
    route: 'pass/through',
    method: EndpointMethod.Get,
    provideParams: request => request,
    responseTransformer: response => response
});

const passThroughEndpointPost = new Endpoint<any, any>({
    route: 'pass/through/post',
    method: EndpointMethod.Post,
    provideParams: request => request,
    responseTransformer: response => response
});

const plainTextEndpoint = new Endpoint<string, { text: string }>({
    route: 'plaintext',
    method: EndpointMethod.Post,
    responseType: ResponseType.PlainText,
    provideParams: request => request,
    responseTransformer: (_response, _request, plainText) => plainText
});

const mixedContentEndpoint = new Endpoint<any, { text: string }>({
    route: 'mixed',
    method: EndpointMethod.Post,
    responseType: ResponseType.Both,
    provideParams: request => request,
    responseTransformer: (response, _request, plainText) => ({
        ...response,
        plainText
    })
});

const slugEndpoint = new Endpoint<
    any,
    { stringParam: string; numericParam: number }
>({
    route: 'slug/{stringParam}/{numericParam}',
    method: EndpointMethod.Post,
    provideSlug: request => request,
    responseTransformer: response => response
});

class MockURLSearchParams {
    private _value = {};

    append(key: string, value: any) {
        if (this._value[key]) {
            this._value[key].push(value);
        } else {
            this._value[key] = [value];
        }
    }
}

(global as any).URLSearchParams = MockURLSearchParams;

const mockTransport: RequestTransport = jest.fn((url, input) => {
    const body = input.body ? (input.body as any)._value : {};
    const mockResponse = {
        clone: () => mockResponse,
        text: () => JSON.stringify(body),
        json: () => ({
            __MOCK_URL: url,
            headers: input.headers,
            body
        })
    };

    return Promise.resolve(mockResponse) as any;
});

const mockTransportFaulty: RequestTransport = () => {
    return new Promise((_resolve, reject) => {
        setTimeout(() => {
            reject('FAULTY_MOCK_TRANSPORT');
        }, 500);
    });
};

class MockClient extends Client {
    getTest = this.endpoint(testEndpoint);
    passThrough = this.parametrizedEndpoint(passThroughEndpointGet);
    passThroughPost = this.parametrizedEndpoint(passThroughEndpointPost);
    plainText = this.parametrizedEndpoint(plainTextEndpoint);
    mixed = this.parametrizedEndpoint(mixedContentEndpoint);
    slug = this.parametrizedEndpoint(slugEndpoint);
    defaultsEndpoint = this.parametrizedEndpoint(passThroughEndpointPost, {
        defaultParam1: 'QA_VALUE_1',
        defaultParam2: 2
    });
}

describe('Abstract client', () => {
    it('Should perform requests', async () => {
        const client = new MockClient('https://example.org', {
            apiEndpoint: 'api/v1',
            transport: mockTransport
        });

        const result = await client.getTest();
        expect(result).toMatchObject({
            __MOCK_URL: 'https://example.org/api/v1/getTest'
        });
    });

    it('Should properly format GET request URL', async () => {
        const client = new MockClient('https://example.org', {
            apiEndpoint: 'api/v1',
            transport: mockTransport
        });

        const response = await client.passThrough({
            first: 'hello',
            second: 'world',
            undefArg: undefined,
            multiple: [1, 2, 3]
        });

        expect(response).toMatchObject({
            __MOCK_URL:
                'https://example.org/api/v1/pass/through?first=hello&multiple=1,2,3&second=world',
            body: {}
        });
    });

    it('Should not include questionmark in empty GET request', async () => {
        const client = new MockClient('https://example.org', {
            apiEndpoint: 'api/v1',
            transport: mockTransport
        });

        const response = await client.passThrough({
            undefArg: undefined
        });

        expect(response).toMatchObject({
            __MOCK_URL: 'https://example.org/api/v1/pass/through',
            body: {}
        });
    });

    it('Should properly format POST request URL', async () => {
        const client = new MockClient('https://example.org', {
            apiEndpoint: 'api/v1',
            transport: mockTransport
        });

        const response = await client.passThroughPost({
            first: 'hello',
            multiple: [1, 2, 3],
            undefArg: undefined,
            second: 'world'
        });

        expect(response).toMatchObject({
            __MOCK_URL: 'https://example.org/api/v1/pass/through/post',
            body: {
                first: ['hello'],
                multiple: ['1', '2', '3'],
                second: ['world']
            }
        });
    });

    it('Should handle custom headers', async () => {
        const client = new MockClient('', {
            transport: mockTransport,
            headers: {
                QATag: 'test'
            }
        });

        const response = await client.passThroughPost({});

        expect(response.headers).toMatchObject({
            QATag: 'test'
        });
    });

    it('Should handle middleware', async () => {
        const mockMiddleware = jest.fn((response: any) => ({
            ...response,
            timestamp: Date.now()
        }));

        const client = new MockClient('', {
            transport: mockTransport,
            middleware: [mockMiddleware]
        });

        const response = await client.passThroughPost({});

        expect(typeof response.timestamp).toBe('number');
    });

    it('Should handle plaintext endpoints', async () => {
        const client = new MockClient('', {
            transport: mockTransport
        });

        const response = await client.plainText({ text: 'Hello World!' });
        expect(response).toBe(JSON.stringify({ text: ['Hello World!'] }));
    });

    it('Should handle both json and plaintext endpoints', async () => {
        const client = new MockClient('', {
            transport: mockTransport
        });

        const response = await client.mixed({ text: 'Hello World!' });

        expect(response).toMatchObject({
            body: {
                text: ['Hello World!']
            },
            plainText: JSON.stringify({ text: ['Hello World!'] })
        });
    });

    it('Should handle URL slug', async () => {
        const client = new MockClient('http://example.org/{stringParam}/', {
            apiEndpoint: '{numericParam}',
            transport: mockTransport
        });

        const response = await client.slug({
            stringParam: 'test',
            numericParam: 512
        });

        expect(response.__MOCK_URL).toBe(
            'http://example.org/{stringParam}/{numericParam}/slug/test/512'
        );
    });

    it('Should strip URL slug params that are missing', async () => {
        const client = new MockClient('http://example.org/{stringParam}/', {
            apiEndpoint: '{numericParam}',
            transport: mockTransport
        });

        const response = await client.slug({});

        expect(response.__MOCK_URL).toBe(
            'http://example.org/{stringParam}/{numericParam}/slug'
        );
    });

    it('Should throw NetworkError if transport is faulty', async () => {
        const client = new MockClient('http://example.org/{stringParam}/', {
            apiEndpoint: '{numericParam}',
            transport: mockTransportFaulty
        });

        try {
            await client.getTest();
        } catch (e) {
            expect(e).toEqual(new NetworkError('FAULTY_MOCK_TRANSPORT'));
        }
    });

    it('Should handle endpoint default params', async () => {
        const client = new MockClient('http://example.org/test', {
            apiEndpoint: 'test',
            transport: mockTransport
        });

        expect(await client.defaultsEndpoint({})).toMatchObject({
            body: {
                defaultParam1: ['QA_VALUE_1'],
                defaultParam2: ['2']
            }
        });

        expect(
            await client.defaultsEndpoint({ defaultParam1: 'substitute' })
        ).toMatchObject({
            body: {
                defaultParam1: ['substitute'],
                defaultParam2: ['2']
            }
        });

        expect(
            await client.defaultsEndpoint({
                defaultParam1: 'substitute',
                defaultParam2: 16,
                additionalProp: 'QA_TEST_DATA'
            })
        ).toMatchObject({
            body: {
                defaultParam1: ['substitute'],
                defaultParam2: ['16'],
                additionalProp: ['QA_TEST_DATA']
            }
        });
    });
});
