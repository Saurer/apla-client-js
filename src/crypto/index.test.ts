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
