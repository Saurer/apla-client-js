/*---------------------------------------------------------------------------------------------
 *  Copyright (c) EGAAS S.A. All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const toHex = (buffer: ArrayBuffer): string => {
    return Array.prototype.map
        .call(new Uint8Array(buffer), (x: number) =>
            ('00' + x.toString(16)).slice(-2)
        )
        .join('')
        .toUpperCase();
};

export const toUint8Array = async (data: string) => {
    if ('undefined' === typeof window || !window.TextEncoder) {
        const util = await import('util');
        const encoder = new util.TextEncoder();
        return encoder.encode(data);
    } else {
        const encoder = new TextEncoder();
        return encoder.encode(data);
    }
};
