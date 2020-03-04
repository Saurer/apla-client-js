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

import endpoint from './contentMenu';
import urlTemplate from 'url-template';
import { EndpointResponseType } from '..';

const testPayload = {
    locale: 'QA_TEST_LOCALE',
    name: 'QA_TEST_NAME',
    params: {
        qaTestParam: 'QA_TEST_VALUE'
    }
};

describe('ContentMenu', () => {
    it('Must provide required url slug', () => {
        const template = urlTemplate.parse(endpoint.route);
        expect(template.expand(endpoint.serialize(testPayload).slug)).toBe(
            'content/menu/QA_TEST_NAME'
        );
    });

    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize(testPayload).getResponse(
                {
                    tree: [
                        {
                            tag: 'QA_TEST_TAG',
                            text: 'QA_TEST_TEXT',
                            attr: {
                                qaTestAttr: 'QA_TEST_VALUE'
                            },
                            children: null
                        }
                    ],
                    title: 'QA_TEST_TITLE'
                },
                '',
                null as any
            )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>({
            tree: [
                {
                    tag: 'QA_TEST_TAG',
                    text: 'QA_TEST_TEXT',
                    attr: {
                        qaTestAttr: 'QA_TEST_VALUE'
                    },
                    children: null
                }
            ],
            title: 'QA_TEST_TITLE'
        });

        expect(
            endpoint.serialize(testPayload).getResponse({}, '', null as any)
        ).toMatchObject<EndpointResponseType<typeof endpoint>>({
            tree: [],
            title: ''
        });
    });

    it('Must correctly pass all expected params', () => {
        expect(endpoint.serialize(testPayload).body).toMatchObject({
            qaTestParam: 'QA_TEST_VALUE',
            lang: 'QA_TEST_LOCALE'
        });
    });
});
