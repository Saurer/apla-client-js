import endpoint from './authStatus';
import { EndpointResponseType } from '../';

describe('AuthStatus', () => {
    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize().getResponse(
                {
                    active: true,
                    exp: '1024'
                },
                ''
            )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>({
            active: true,
            expiry: 1024
        });
    });

    it('Must provide a fallback if certain properties are missing', () => {
        expect(
            endpoint.serialize().getResponse(
                {
                    active: false
                },
                ''
            )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>({
            active: false,
            expiry: 0
        });
    });
});
