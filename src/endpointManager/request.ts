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

import urlJoin from 'url-join';
import { RequestTransport } from '.';
import Endpoint, { ResponseType, EndpointMethod } from '../endpoint';
import querySerializer from './serializers/querySerializer';
import bodySerializer from './serializers/bodySerializer';
import slugSerializer from './serializers/slugSerializer';
import {
    NetworkError,
    InvalidResponseTypeError,
    ResponseError
} from '../types/error';

interface RequestInit<TResponse, TRequest> {
    endpoint: Endpoint<TResponse, TRequest>;
    transport: RequestTransport;
    apiHost: string;
    params: TRequest;
    headers?: {
        [name: string]: string;
    };
}

export default async <TResponse, TRequest>(
    options: RequestInit<TResponse, TRequest>
) => {
    const request = options.endpoint.serialize(options.params);
    const query = querySerializer(request.query);
    const body = bodySerializer(request.body, options.endpoint.useFormData);
    const route = slugSerializer(options.endpoint.route, request.slug);
    const requestUrl = urlJoin(
        options.apiHost,
        route,
        query ? `?${query}` : ''
    );

    let response: Response;

    try {
        response = await options.transport(requestUrl, {
            method: options.endpoint.method,
            mode: 'cors',
            body: EndpointMethod.Get === options.endpoint.method ? null : body,
            headers: options.headers ?? {}
        });
    } catch (e) {
        throw new NetworkError(e);
    }

    let json: any = null;
    let plainText: string = '';

    switch (options.endpoint.responseType) {
        case ResponseType.Both:
            plainText = await response.clone().text();
            json = await response.json();
            break;

        case ResponseType.PlainText:
            plainText = await response.text();
            break;

        case ResponseType.Json:
            json = await response.json();
            break;

        default:
            throw new InvalidResponseTypeError(
                String(options.endpoint.responseType)
            );
    }

    if (!response.ok) {
        throw new ResponseError(response.status, response.statusText);
    }

    return request.getResponse(json, plainText) as TResponse;
};
