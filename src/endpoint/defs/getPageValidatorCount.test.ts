import endpoint from './getPageValidatorCount';
import urlTemplate from 'url-template';

describe('GetPageValidatorCount', () => {
    it('Must provide required url slug', () => {
        const template = urlTemplate.parse(endpoint.route);
        expect(
            template.expand(endpoint.serialize({ name: 'QA_TEST_NAME' }).slug)
        ).toBe('page/validators_count/QA_TEST_NAME');
    });

    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize({ name: 'QA_TEST_NAME' }).getResponse(
                {
                    validate_count: '123'
                },
                ''
            )
        ).toBe(123);

        expect(
            endpoint.serialize({ name: 'QA_TEST_NAME' }).getResponse({}, '')
        ).toBe(0);
    });
});
