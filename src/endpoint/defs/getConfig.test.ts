import endpoint from './getConfig';
import urlTemplate from 'url-template';
import { ConfigType } from '../../types/config';

describe('GetConfig', () => {
    it('Must provide required url slug', () => {
        const template = urlTemplate.parse(endpoint.route);
        expect(
            template.expand(
                endpoint.serialize({ type: ConfigType.WebsocketHost }).slug
            )
        ).toBe(`config/${ConfigType.WebsocketHost}`);
    });
});
