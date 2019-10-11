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
