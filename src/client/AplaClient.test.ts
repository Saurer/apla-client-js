import AplaClient, { AplaClientOptions } from './AplaClient';
import { RequestTransport } from './Client';

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
});
