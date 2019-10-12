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

import endpoint from './getSections';
import { SectionStatus } from '../../types/section';

describe('GetSections', () => {
    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize({ locale: 'QA_TEST_LOCALE' }).getResponse(
                {
                    list: [
                        {
                            id: 'QA_TEST_ID',
                            status: 1,
                            page: 'QA_TEST_PAGE',
                            title: 'QA_TEST_TITLE',
                            urlname: 'QA_TEST_ROUTE'
                        },
                        {
                            id: 'QA_MAIN_ID',
                            status: SectionStatus.Main,
                            page: 'QA_MAIN_PAGE',
                            title: 'QA_MAIN_TITLE',
                            urlname: 'QA_MAIN_ROUTE'
                        }
                    ]
                },
                ''
            )
        ).toMatchObject({
            mainIndex: 1,
            values: [
                {
                    id: 'QA_TEST_ID',
                    defaultPage: 'QA_TEST_PAGE',
                    title: 'QA_TEST_TITLE',
                    route: 'QA_TEST_ROUTE'
                },
                {
                    id: 'QA_MAIN_ID',
                    status: SectionStatus.Main,
                    defaultPage: 'QA_MAIN_PAGE',
                    title: 'QA_MAIN_TITLE',
                    route: 'QA_MAIN_ROUTE'
                }
            ]
        });
    });

    it('Must correctly pass all expected params', () => {
        expect(
            endpoint.serialize({ locale: 'QA_TEST_LOCALE' }).body
        ).toMatchObject({
            offset: 0,
            limit: 10,
            lang: 'QA_TEST_LOCALE'
        });
    });
});
