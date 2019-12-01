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

import ValidationStrategy from './validationStrategy';
import { UnalignedNetworkError } from '../types/error';

export interface MulticastOptions<TResponse> {
    strategy?: ValidationStrategy<TResponse>;
}

export default async <TResponse>(
    results: TResponse[],
    options: MulticastOptions<TResponse> = {}
) => {
    const validResult = results.find(l => null !== l);
    const strategy: ValidationStrategy<TResponse> =
        options.strategy ?? new ValidationStrategy(results);
    const multicastResult = await strategy.validate();

    if (validResult && multicastResult) {
        return {
            count: results.length,
            date: new Date(),
            response: validResult!
        };
    } else {
        throw new UnalignedNetworkError();
    }
};
