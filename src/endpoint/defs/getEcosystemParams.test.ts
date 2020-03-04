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

import endpoint from './getEcosystemParams';
import { EndpointResponseType } from '..';

describe('GetEcosystemParams', () => {
    it('Must correctly transform response', () => {
        expect(
            endpoint
                .serialize({ names: ['QA_FIRST', 'QA_SECOND'] })
                .getResponse(
                    {
                        list: [
                            {
                                id: 'QA_FIRST_ID',
                                name: 'QA_FIRST',
                                value: 'QA_FIRST_VALUE',
                                conditions: 'QA_FIRST_CONDITIONS'
                            },
                            {
                                id: 'QA_SECOND_ID',
                                name: 'QA_SECOND',
                                value: 'QA_SECOND_VALUE',
                                conditions: 'QA_SECOND_CONDITIONS'
                            }
                        ]
                    },
                    '',
                    null as any
                )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>({
            QA_FIRST: {
                id: 'QA_FIRST_ID',
                name: 'QA_FIRST',
                value: 'QA_FIRST_VALUE',
                conditions: 'QA_FIRST_CONDITIONS'
            },
            QA_SECOND: {
                id: 'QA_SECOND_ID',
                name: 'QA_SECOND',
                value: 'QA_SECOND_VALUE',
                conditions: 'QA_SECOND_CONDITIONS'
            }
        });
    });

    it('Must correctly pass all expected params', () => {
        expect(
            endpoint.serialize({ names: ['QA_FIRST', 'QA_SECOND'] }).body
        ).toMatchObject({
            names: ['QA_FIRST', 'QA_SECOND']
        });
    });
});
