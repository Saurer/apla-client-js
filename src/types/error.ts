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