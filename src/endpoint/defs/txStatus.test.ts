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

import endpoint from './txStatus';
import { EndpointResponseType } from '..';

const testPayload = {
    hashes: ['first', 'second', 'third', 'fourth']
};

describe('TxStatus', () => {
    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize(testPayload).getResponse(
                {
                    results: {
                        first: {
                            blockid: '256'
                        },
                        second: {
                            blockid: '512',
                            result: 'withResult'
                        },
                        third: {
                            errmsg: {
                                type: 'QA_TEST_TYPE',
                                error: 'QA_TEST_ERROR'
                            }
                        },
                        fourth: {
                            errmsg: {
                                id: '384',
                                type: 'QA_TEST_TYPE',
                                error: 'QA_TEST_ERROR'
                            }
                        }
                    }
                },
                '',
                null as any
            )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>({
            first: {
                blockid: '256'
            },
            second: {
                blockid: '512',
                result: 'withResult'
            },
            third: {
                errmsg: {
                    type: 'QA_TEST_TYPE',
                    error: 'QA_TEST_ERROR'
                }
            },
            fourth: {
                errmsg: {
                    id: '384',
                    type: 'QA_TEST_TYPE',
                    error: 'QA_TEST_ERROR'
                }
            }
        });
    });

    it('Must correctly pass all expected params', () => {
        expect(endpoint.serialize(testPayload).body).toMatchObject({
            data: '{"hashes":["first","second","third","fourth"]}'
        });
    });
});
