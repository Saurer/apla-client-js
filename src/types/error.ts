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

export class APIError extends Error {
    public params: string[] = [];

    constructor(name: string, message: string, params?: string[]) {
        super(message);

        this.name = name;
        this.message = message;

        if (params) {
            this.params = params;
        }
    }
}

export class InvalidResponseTypeError extends APIError {
    constructor(value: string) {
        super(
            'E_INVALID_RESPONSE_TYPE',
            'Specified response type is not supported',
            [value]
        );
    }
}

export class NetworkError extends APIError {
    private _baseError: any;

    constructor(baseError: any) {
        let message: string;

        if ('object' === typeof baseError) {
            message = baseError.message;
        } else if ('string' === typeof baseError) {
            message = baseError;
        } else {
            message = 'Unknown error';
        }

        super('E_NETWORK', message);
        this._baseError = baseError;
    }

    public get baseError() {
        return this._baseError;
    }
}

export class ResponseError extends APIError {
    constructor(statusCode: number, message: string) {
        super(
            'E_RESPONSE',
            'Request could not be completed due to server responded with status code error',
            [String(statusCode), message]
        );
    }
}

export class MissingTransportError extends APIError {
    constructor() {
        super(
            'E_MISSING_TRANSPORT',
            'Request transport is not specified and could not be extracted from environment defaults'
        );
    }
}

export class RetryExceededError extends APIError {
    constructor() {
        super('E_RETRY_EXCEEDED', 'Retry count exceeded');
    }
}

export class UnalignedNetworkError extends APIError {
    constructor() {
        super(
            'E_UNALIGNED_NETWORK',
            'Request could not be completed due to erroneous response on some of the nodes'
        );
    }
}

export class ForeignKeyError extends APIError {
    constructor() {
        super(
            'E_FOREIGN_KEY',
            'Specified key is not valid for this type of entity'
        );
    }
}

export class SocketConnectionError extends APIError {
    constructor(reason: any) {
        super(
            'E_SOCKET_CONNECTION',
            'Unable to connect to centrifugo server instance',
            reason
        );
    }
}
