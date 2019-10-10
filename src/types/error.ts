/*---------------------------------------------------------------------------------------------
 *  Copyright (c) EGAAS S.A. All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

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

export class MissingTransportError extends Error {
    constructor() {
        const message =
            'Request transport is not specified and could not be extracted from environment defaults';
        super(message);

        this.name = 'MissingTransport';
        this.message = message;
    }
}

export class NetworkError extends Error {
    private _baseError: any;

    constructor(baseError: any) {
        if ('object' === typeof baseError) {
            super(baseError.message);
            this.message = baseError.message;
        } else if ('string' === typeof baseError) {
            super(baseError);
            this.message = baseError;
        } else {
            const message = 'Unknown error';
            super(message);
            this.message = message;
        }

        this.name = 'NetworkError';
        this._baseError = baseError;
    }

    public get baseError() {
        return this._baseError;
    }
}
