import endpoint from './metrics';
import urlTemplate from 'url-template';
import { MetricType } from '../../types/metric';

describe('Metrics', () => {
    it('Must provide required url slug', () => {
        const template = urlTemplate.parse(endpoint.route);
        expect(
            template.expand(
                endpoint.serialize({ type: MetricType.FullNodes }).slug
            )
        ).toBe('metrics/fullnodes');
    });

    it('Must correctly transform response', () => {
        expect(
            endpoint
                .serialize({ type: MetricType.FullNodes })
                .getResponse({}, '')
        ).toBe(0);

        expect(
            endpoint.serialize({ type: MetricType.FullNodes }).getResponse(
                {
                    count: '128'
                },
                ''
            )
        ).toBe(128);
    });
});
