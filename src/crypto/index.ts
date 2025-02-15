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

import SubtleCrypto from './impl/SubtleCrypto';
import platform, { PlatformType } from '../util/platform';
import EllipticCrypto from './impl/EllipticCrypto';
import CryptoProvider from './cryptoProvider';

let provider: CryptoProvider;

switch (platform) {
    case PlatformType.Browser:
        if (
            'undefined' === typeof window.crypto ||
            'undefined' === typeof window.crypto.subtle
        ) {
            provider = new EllipticCrypto();
        } else {
            provider = new SubtleCrypto(window.crypto.subtle);
        }
        break;

    case PlatformType.ReactNative: {
        const IsomorphicCrypto = require('./impl/IsomorphicCrypto').default;
        provider = new IsomorphicCrypto();
        break;
    }

    default: {
        const OpenSSLCrypto = require('node-webcrypto-ossl');
        provider = new SubtleCrypto(new OpenSSLCrypto().subtle);
        break;
    }
}

export default provider;
