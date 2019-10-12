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
