import { toHex, toArrayBuffer, toUint8Array } from '.';

class MockTextEncoder {
    encode = async (data: string) => {
        const util = await import('util');
        const encoder = new util.TextEncoder();
        return encoder.encode(data);
    };
}

describe('Converter', () => {
    it('Should convert ArrayBuffer to hex', () => {
        const buffer = new Uint8Array([4, 8, 15, 16, 23, 42]);
        const hex = toHex(buffer.buffer);

        expect(hex).toEqual('04080F10172A');
    });

    it('Should convert a string to Uint8Array', async () => {
        const buffer = await toUint8Array('4 8 15 16 23 42');
        const str = Array.prototype.map
            .call(buffer, l => String.fromCharCode(l))
            .join('');

        expect(str).toEqual('4 8 15 16 23 42');
    });

    it('Should convert to ArrayBuffer from string', async () => {
        const buffer = await toArrayBuffer('4 8 15 16 23 42');
        const arr = new Uint8Array(buffer);
        const str = Array.prototype.map
            .call(arr, l => String.fromCharCode(l))
            .join('');

        expect(str).toEqual('4 8 15 16 23 42');
    });

    it('Should consume native TextEncoder if present', async () => {
        const anyGlobal = global as any;
        anyGlobal.window = {
            TextEncoder: MockTextEncoder
        };
        anyGlobal.TextEncoder = MockTextEncoder;

        const buffer = await toArrayBuffer('4 8 15 16 23 42');
        const uintArr = new Uint8Array(buffer);
        const arr = Array.from(uintArr);
        const str = arr.map(l => String.fromCharCode(l)).join('');

        expect(str).toEqual('4 8 15 16 23 42');
    });
});
