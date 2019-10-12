import endpoint from './metricsBan';
import { EndpointResponseType } from '..';

describe('MetricsBan', () => {
    it('Must correctly transform response', () => {
        expect(
            endpoint.serialize().getResponse(
                [
                    {
                        node_position: 128,
                        status: true
                    }
                ],
                ''
            )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>([
            {
                nodePosition: 128,
                status: true
            }
        ]);
    });
});
