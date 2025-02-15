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

import Endpoint, { EndpointMethod } from '../';
import { SerializedTransaction } from '../../types/tx';
import platform, { PlatformType } from '../../util/platform';
import { toHex } from '../../convert';

type Request = {
    tx: SerializedTransaction | SerializedTransaction[];
};

type Response = string[];

export default new Endpoint<Response, Request>({
    method: EndpointMethod.Post,
    route: 'sendTx',
    useFormData: true,
    body: request =>
        (Array.prototype.concat(request.tx) as SerializedTransaction[]).reduce(
            (acc, tx) => {
                if (PlatformType.ReactNative === platform) {
                    acc[tx.hash] = toHex(tx.body);
                } else {
                    acc[tx.hash] = new Blob([tx.body]);
                }
                return acc;
            },
            {}
        ),
    response: response => Object.keys(response.hashes)
});
