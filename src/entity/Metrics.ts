// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

import Entity from '.';
import Node from './Node';
import { MetricType } from '../types/metric';
import EndpointManager from '../endpointManager';
import metrics from '../endpoint/defs/metrics';
import metricsMemory from '../endpoint/defs/metricsMemory';

export default class Metrics extends Entity {
    public constructor(endpointManager: EndpointManager, node: Node) {
        super(endpointManager);
        this.node = node;
    }

    public readonly node: Node;

    public readonly keys = this.bindParams(metrics, MetricType.Keys);
    public readonly blocks = this.bindParams(metrics, MetricType.Blocks);
    public readonly fullNodes = this.bindParams(metrics, MetricType.FullNodes);
    public readonly memory = this.bind(metricsMemory);
    public readonly ecosystems = this.bindParams(
        metrics,
        MetricType.Ecosystems
    );
    public readonly transactions = this.bindParams(
        metrics,
        MetricType.Transactions
    );
}
