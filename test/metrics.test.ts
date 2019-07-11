/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import nodeClient from './fixtures/nodeClient';
import { MetricType } from '../src/types/metric';

describe('Metrics endpoint', () => {
    it('Should return number of keys', async () => {
        const client = nodeClient();
        const result = await client.metrics({ type: MetricType.Keys });
        expect(result).toBeGreaterThanOrEqual(1);
    });

    it('Should return number of blocks', async () => {
        const client = nodeClient();
        const result = await client.metrics({ type: MetricType.Blocks });
        expect(result).toBeGreaterThanOrEqual(1);
    });


    it('Should return number of ecosystems', async () => {
        const client = nodeClient();
        const result = await client.metrics({ type: MetricType.Ecosystems });
        expect(result).toBeGreaterThanOrEqual(1);
    });

    it('Should return number of fullnodes', async () => {
        const client = nodeClient();
        const result = await client.metrics({ type: MetricType.FullNodes });
        expect(result).toBeGreaterThanOrEqual(1);
    });

    it('Should return number of transactions', async () => {
        const client = nodeClient();
        const result = await client.metrics({ type: MetricType.Transactions });
        expect(result).toBeGreaterThanOrEqual(1);
    });

    it('Should return memory usage', async () => {
        const client = nodeClient();
        const result = await client.metricsMemory();
        expect(result.sys).toBeGreaterThan(0);
        expect(result.alloc).toBeGreaterThan(0);
    });


    it('Should return ban count', async () => {
        const client = nodeClient();
        const result = await client.metricsBan();
        result.forEach(node => {
            expect(node.nodePosition).toBeGreaterThanOrEqual(0);
            expect(typeof node.status).toBe('boolean');
        });
    });
});