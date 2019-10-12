import endpoint from './getTable';
import urlTemplate from 'url-template';
import { EndpointResponseType } from '..';

describe('GetTable', () => {
    it('Must provide required url slug', () => {
        const template = urlTemplate.parse(endpoint.route);
        expect(
            template.expand(endpoint.serialize({ name: 'QA_TEST_NAME' }).slug)
        ).toBe('table/QA_TEST_NAME');
    });

    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize({ name: 'QA_TEST_NAME' }).getResponse(
                {
                    app_id: 'QA_TEST_APP',
                    name: 'QA_TEST_NAME',
                    conditions: 'QA_TEST_CONDITIONS',
                    insert: 'QA_TEST_INSERT',
                    new_column: 'QA_TEST_NEWCOL',
                    update: 'QA_TEST_UPDATE',
                    read: 'QA_TEST_READ',
                    filter: 'QA_TEST_FILTER',
                    columns: [
                        {
                            name: 'QA_COL_NAME',
                            type: 'money',
                            perm: 'QA_COL_PERM'
                        }
                    ]
                },
                ''
            )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>({
            appID: 'QA_TEST_APP',
            name: 'QA_TEST_NAME',
            conditions: 'QA_TEST_CONDITIONS',
            permissions: {
                insert: 'QA_TEST_INSERT',
                newColumn: 'QA_TEST_NEWCOL',
                update: 'QA_TEST_UPDATE',
                read: 'QA_TEST_READ',
                filter: 'QA_TEST_FILTER'
            },
            columns: [
                {
                    name: 'QA_COL_NAME',
                    type: 'money',
                    permissions: 'QA_COL_PERM'
                }
            ]
        });
    });
});
