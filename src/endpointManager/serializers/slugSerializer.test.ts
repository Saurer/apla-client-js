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

import slugSerializer from './slugSerializer';

describe('Slug serializer', () => {
    it('Substitutes simple types', () =>
        expect(
            slugSerializer('/route/{strValue}/{boolValue}/{numericValue}', {
                strValue: 'QA_STRVALUE',
                boolValue: true,
                numericValue: 2048
            })
        ).toBe('/route/QA_STRVALUE/true/2048'));

    it('Skips excessive params', () =>
        expect(
            slugSerializer('/route/test/value', {
                route: 'QA_ROUTE',
                test: 256,
                value: true
            })
        ).toBe('/route/test/value'));

    it('Strips excessive slugs', () =>
        expect(slugSerializer('/route/{test}/{value}', {})).toBe('/route//'));
});
