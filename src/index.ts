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

import Network, { NetworkConnectParams } from './entity/Network';
import { RequestTransport } from './endpointManager';
import { MissingTransportError } from './types/error';
import platform, { PlatformType } from './util/platform';

const defaultTransport: () => RequestTransport = () => {
    switch (platform) {
        case PlatformType.Browser:
            return (url, init) => window.fetch(url, init);

        case PlatformType.ReactNative:
            return (url, init) => fetch(url, init);

        default:
            throw new MissingTransportError();
    }
};

interface ConnectParams extends Partial<NetworkConnectParams> {
    fullNodes: string[];
}

export const connect = async (options: ConnectParams) =>
    await Network.connect({
        ...options,
        transport: options.transport ?? defaultTransport()
    });

export const defaultKey =
    'e5a87a96a445cb55a214edaad3661018061ef2936e63a0a93bdb76eb28251c1f';
