import endpoint from './balance';
import { EndpointResponseType } from '../';
import urlTemplate from 'url-template';

describe('Balance', () => {
    it('Must provide required url slug', () => {
        const template = urlTemplate.parse(endpoint.route);
        expect(
            template.expand(
                endpoint.serialize({ account: 'QA_TEST_ACCOUNT' }).slug
            )
        ).toBe('balance/QA_TEST_ACCOUNT');
    });

    it('Must provide a valid response', () => {
        expect(
            endpoint.serialize({ account: 'stub' }).getResponse(
                {
                    amount: '256',
                    money: '512'
                },
                ''
            )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>({
            amount: '256',
            money: '512'
        });
    });
});
