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

import transformInterface from './transformInterface';
import { Interface, Page } from '../../types/interface';

describe('Interface transformer', () => {
    it('Should force cast interface ID to string', () => {
        const result = transformInterface({
            id: 4815162342
        });

        expect(result).toMatchObject({
            id: '4815162342'
        });
    });

    it('Should correctly transform interface types', () => {
        const result = transformInterface({
            id: 32,
            name: 'QA_TEST_NAME',
            value: 'QA_TEST_VALUE',
            conditions: 'QA_TEST_CONDITIONS'
        });

        expect(result).toMatchObject<Interface>({
            id: '32',
            name: 'QA_TEST_NAME',
            value: 'QA_TEST_VALUE',
            conditions: 'QA_TEST_CONDITIONS'
        });
    });

    it('Should correctly transform page type', () => {
        const result = transformInterface({
            id: 16,
            name: 'QA_TEST_PAGE',
            value: 'QA_TEST_VALUE',
            conditions: 'QA_TEST_CONDITIONS',
            menu: 'QA_TEST_MENU'
        });

        expect(result).toMatchObject<Page>({
            id: '16',
            name: 'QA_TEST_PAGE',
            value: 'QA_TEST_VALUE',
            conditions: 'QA_TEST_CONDITIONS',
            menu: 'QA_TEST_MENU'
        });
    });
});

export default transformInterface;
