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
                    ''
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
