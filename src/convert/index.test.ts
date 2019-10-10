import {
    toHex,
    toUint8Array,
    concatBuffer,
    encodeLength,
    encodeLengthPlusData,
    toMoney,
    publicToID,
    toAddress
} from '.';

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
            .call(buffer, (l: number) => String.fromCharCode(l))
            .join('');

        expect(str).toEqual('4 8 15 16 23 42');
    });

    it('Should consume native TextEncoder if present', async () => {
        const anyGlobal = global as any;
        anyGlobal.window = {
            TextEncoder: MockTextEncoder
        };
        anyGlobal.TextEncoder = MockTextEncoder;

        const buffer = await toUint8Array('4 8 15 16 23 42');
        const uintArr = new Uint8Array(buffer);
        const arr = Array.from(uintArr);
        const str = arr.map(l => String.fromCharCode(l)).join('');

        expect(str).toEqual('4 8 15 16 23 42');
    });

    it('Should concat two arrays with deterministic result', () => {
        const a = new Uint8Array([4, 8, 15]);
        const b = new Uint8Array([16, 23, 42]);
        const result = concatBuffer(a, b);

        expect(result).toEqual(new Uint8Array([4, 8, 15, 16, 23, 42]));
    });

    it('Should correctly encode length', () => {
        expect(encodeLength(32)).toEqual(new Uint8Array([32]));
        expect(encodeLength(64)).toEqual(new Uint8Array([64]));
        expect(encodeLength(128)).toEqual(new Uint8Array([129, 128]));
        expect(encodeLength(256)).toEqual(new Uint8Array([130, 1, 0]));
        expect(encodeLength(512)).toEqual(new Uint8Array([130, 2, 0]));
        expect(encodeLength(1024)).toEqual(new Uint8Array([130, 4, 0]));
    });

    it('Should correctly encode length with data', async () => {
        const data = await toUint8Array('Hello World!');

        expect(encodeLengthPlusData(data)).toEqual(
            concatBuffer(encodeLength(data.length), data)
        );
    });

    it('Should correctly convert money', () => {
        expect(toMoney('0.000000000000000128')).toBe('128');
        expect(toMoney('0.000000000000001024')).toBe('1024');
        expect(toMoney('0.000000000042853023')).toBe('42853023');
        expect(toMoney('12.000050080000000128')).toBe('12000050080000000128');
        expect(toMoney('0')).toBe('0');
        expect(toMoney('4815162342')).toBe('4815162342000000000000000000');
        expect(toMoney('12.000050080000000000')).toBe('12000050080000000000');
        expect(toMoney('0.0000000000000000001')).toBe('0.1');
    });

    it('Should correctly override money power', () => {
        expect(toMoney('0.128', 3)).toBe('128');
        expect(toMoney('1.024', 3)).toBe('1024');
        expect(toMoney('42853.023', 3)).toBe('42853023');
        expect(toMoney('12000050080000000.128', 3)).toBe(
            '12000050080000000128'
        );
        expect(toMoney('0', 3)).toBe('0');
        expect(toMoney('4815162342', 3)).toBe('4815162342000');
        expect(toMoney('0.0001', 3)).toBe('0.1');
    });

    it('Should return null if passed money argument is incorrect', () => {
        expect(toMoney('abc')).toBe(null);
    });

    it('Should convert public key to known KeyID', async () => {
        expect(
            await publicToID(
                '04489347a1205c818d9a02f285faaedd0122a56138e3d985f5e1b4f6a9470f90f692a00a3453771dd7feea388ceb7aefeaf183e299c70ad1aecb7f870bfada3b86'
            )
        ).toBe('4544233900443112470');

        expect(
            await publicToID(
                '04ea0cdb0f9b2a8d7fa7403fe302c3f4686e0e52ef3d5d473df3d2c477c53bf9d76efc67d93b2b1d7042df219edda66c6c04d51e089e026bbf69e40ecedf1dd556'
            )
        ).toBe('-1465863158328511897');
    });

    it('Should convert KeyID to known address', () => {
        expect(toAddress('4544233900443112470')).toBe(
            '0454-4233-9004-4311-2470'
        );
        expect(toAddress('-1465863158328511897')).toBe(
            '1698-0880-9153-8103-9719'
        );
    });
});
