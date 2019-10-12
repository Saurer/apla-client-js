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

import AplaClient, { AplaClientOptions } from './AplaClient';
import { RequestTransport } from './Client';
import { MissingTransportError } from '../types/error';

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

const getClient = (nodeHost = 'FAKEHOST', options: AplaClientOptions = {}) =>
    new AplaClient(nodeHost, {
        ...options,
        transport: options.transport || mockTransport
    });

describe('AplaClient', () => {
    it('Should construct without errors', () => {
        const client = new AplaClient('FAKEHOST', {
            transport: mockTransport
        });

        expect(client).toBeInstanceOf(AplaClient);
    });

    it('Should pass Authorization header if session is present', async () => {
        const session = 'QA_TEST_SESSION';
        const authorization = {
            Authorization: `Bearer ${session}`
        };

        let headers: HeadersInit | undefined = {};

        const client = getClient(undefined, {
            transport: (_url, init) => {
                headers = init.headers;
                return Promise.resolve({
                    json: () => null
                }) as any;
            }
        });

        await client.getUid();
        expect(headers.Authorization).toBeFalsy();

        const securedClient = client.authorize('QA_TEST_SESSION');
        await securedClient.getUid();

        expect(headers).toMatchObject(authorization);
    });

    it('Should use fetch if exists in browser environment', async () => {
        jest.resetModules();

        const anyGlobal: any = global;
        anyGlobal.window = {
            fetch: mockTransport
        };

        const Client = require('./AplaClient').default;
        const client = new Client('test');

        expect(mockTransport).not.toBeCalled();
        await client.getUid();
        expect(mockTransport).toBeCalledTimes(1);
    });

    it('Should throw if fetch is not found and transport is not specified in browser env', async () => {
        jest.resetModules();

        const anyGlobal: any = global;
        anyGlobal.window = {};

        const Client = require('./AplaClient').default;
        const client = new Client('test');

        await expect(client.getUid()).rejects.toEqual(
            new MissingTransportError()
        );
    });

    it('Should throw if transport is not specified in node env', async () => {
        jest.resetModules();

        const anyGlobal: any = global;
        delete anyGlobal.window;

        const Client = require('./AplaClient').default;
        const client = new Client('test');

        await expect(client.getUid()).rejects.toEqual(
            new MissingTransportError()
        );
    });
});
