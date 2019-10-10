describe('CryptoProvider', () => {
    beforeEach(() => {
        const anyGlobal: any = global;
        delete anyGlobal.window;
        jest.resetModules();
    });

    it('Should use SubtleCrypto in browser env if CryptoApi is available', () => {
        const anyGlobal: any = global;
        anyGlobal.window = {
            crypto: {
                subtle: {}
            }
        };

        const mockSubtleCrypto = jest.fn();
        const mockEllipticCrypto = jest.fn();
        const mockOSSLCrypto = jest.fn();

        jest.mock('./impl/SubtleCrypto', () => mockSubtleCrypto);
        jest.mock('./impl/ellipticCrypto', () => mockEllipticCrypto);
        jest.mock('node-webcrypto-ossl', () => mockOSSLCrypto);
        jest.requireActual('./index');

        expect(mockSubtleCrypto).toHaveBeenCalledTimes(1);
        expect(mockOSSLCrypto).not.toHaveBeenCalled();
        expect(mockEllipticCrypto).not.toHaveBeenCalled();
    });

    it('Should use elliptic in browser env if CryptoApi is unavailable', () => {
        const anyGlobal: any = global;
        anyGlobal.window = {};

        const mockEllipticCrypto = {
            hello: 'world'
        };
        jest.mock('./impl/ellipticCrypto', () => mockEllipticCrypto);

        const crypto = jest.requireActual('./index');
        expect(crypto.default).toBe(mockEllipticCrypto);
    });

    it('Should use SubtleCrypto with OpenSSL in node env', () => {
        const mockSubtleCrypto = jest.fn();
        const mockOSSLCrypto = jest.fn();

        jest.mock('./impl/SubtleCrypto', () => mockSubtleCrypto);
        jest.mock('node-webcrypto-ossl', () => mockOSSLCrypto);
        jest.requireActual('./index');

        expect(mockSubtleCrypto).toHaveBeenCalledTimes(1);
        expect(mockOSSLCrypto).toHaveBeenCalledTimes(1);
    });
});
