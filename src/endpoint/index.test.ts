import Endpoint, { EndpointMethod, ResponseType } from './';

describe('Endpoint base class', () => {
    it('Should correctly serialize route', () => {
        const endpoint = new Endpoint<{ responseParam: 'responseValue' }>({
            method: EndpointMethod.Get,
            route: 'test/route'
        });

        const result = endpoint.serialize();
        expect(result).toMatchObject({
            method: EndpointMethod.Get,
            responseType: ResponseType.Json,
            route: 'test/route',
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
            method: EndpointMethod.Get,
            responseType: ResponseType.Json,
            route: 'test/route/{slug}',
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
            method: EndpointMethod.Get,
            responseType: ResponseType.Json,
            route: 'test/route/{slug}',
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
            method: EndpointMethod.Get,
            responseType: ResponseType.Json,
            route: 'test/route',
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
            method: EndpointMethod.Get,
            responseType: ResponseType.Json,
            route: 'test/route',
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
            method: EndpointMethod.Get,
            responseType: ResponseType.Json,
            route: 'test/route',
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
            method: EndpointMethod.Get,
            responseType: ResponseType.Json,
            route: 'test/route',
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
