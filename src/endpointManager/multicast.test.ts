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

import multicast from './multicast';
import ValidationStrategy from './validationStrategy';
import { UnalignedNetworkError } from '../types/error';

describe('Multicast', () => {
    it('Should validate some equal objects', async () => {
        const obj = { a: 1, b: true, c: 'three' };
        const values = [];

        for (let i = 0; i < 50; i++) {
            values.push({ ...obj });
        }

        await expect(
            multicast(values, {
                strategy: new ValidationStrategy(values)
            })
        ).resolves.toMatchObject({
            count: 50,
            response: obj
        });
    });

    it('Should invalidate null-values', async () => {
        const obj = { a: 1, b: true, c: 'three' };
        const values = [];

        for (let i = 0; i < 50; i++) {
            values.push({ ...obj });
        }

        values.push(null as any);

        await expect(
            multicast(values, {
                strategy: new ValidationStrategy(values)
            })
        ).rejects.toEqual(new UnalignedNetworkError());
    });

    it('Should invalidate differences', async () => {
        const obj = { a: 1, b: true, c: 'three' };
        const values = [];

        for (let i = 0; i < 3; i++) {
            values.push({ ...obj });
        }

        values.push({
            a: 2,
            b: true,
            c: 'three'
        });

        await expect(
            multicast(values, {
                strategy: new ValidationStrategy(values)
            })
        ).rejects.toEqual(new UnalignedNetworkError());
    });

    it('Should use default strategy if not specified', async () => {
        const obj = { a: 1, b: true, c: 'three' };
        const values = [];

        for (let i = 0; i < 50; i++) {
            values.push({ ...obj });
        }

        await expect(multicast(values)).resolves.toMatchObject({
            count: 50,
            response: obj
        });
    });
});
