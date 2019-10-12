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

import Client, { ApiOptions, RequestTransport } from './Client';
import { ContentParams } from '../types/interface';
import { MissingTransportError } from '../types/error';
import { Middleware } from '../endpoint/middleware';
import error from '../endpoint/middleware/error';
import balance from '../endpoint/defs/balance';
import getUid from '../endpoint/defs/getUid';
import login from '../endpoint/defs/login';
import authStatus from '../endpoint/defs/authStatus';
import version from '../endpoint/defs/version';
import getBlocks from '../endpoint/defs/getBlocks';
import getBlocksDetailed from '../endpoint/defs/getBlocksDetailed';
import metrics from '../endpoint/defs/metrics';
import metricsBan from '../endpoint/defs/metricsBan';
import metricsMemory from '../endpoint/defs/metricsMemory';
import getEcosystemName from '../endpoint/defs/getEcosystemName';
import getEcosystemParams from '../endpoint/defs/getEcosystemParams';
import getEcosystemParam from '../endpoint/defs/getEcosystemParam';
import getTables from '../endpoint/defs/getTables';
import getTable from '../endpoint/defs/getTable';
import getRows from '../endpoint/defs/getRows';
import getRow from '../endpoint/defs/getRow';
import getSections from '../endpoint/defs/getSections';
import contentHash from '../endpoint/defs/contentHash';
import contentTest from '../endpoint/defs/contentTest';
import contentPage from '../endpoint/defs/contentPage';
import contentMenu from '../endpoint/defs/contentMenu';
import getAppParams from '../endpoint/defs/getAppParams';
import network from '../endpoint/defs/network';

export interface AplaClientOptions extends Partial<ApiOptions> {
    session?: string;
}

const defaultTransport: RequestTransport =
    'undefined' !== typeof window && 'fetch' in window
        ? (url, init) => window.fetch(url, init)
        : () => {
              throw new MissingTransportError();
          };

const defaultOptions = {
    apiEndpoint: '/api/v2',
    transport: defaultTransport
};

const defaultMiddleware: Middleware[] = [error];

export default class AplaClient extends Client {
    constructor(nodeHost: string, options: AplaClientOptions = {}) {
        super(nodeHost, {
            ...defaultOptions,
            ...options,
            headers: {
                ...options.headers,
                ...(options.session && {
                    Authorization: `Bearer ${options.session}`
                })
            },
            middleware: [...defaultMiddleware, ...(options.middleware || [])]
        });
    }

    authorize = (session: string) =>
        new AplaClient(this.apiHost, {
            ...this.options,
            session
        });

    // Service endpoints
    version = this.endpoint(version);

    // Data getters
    balance = this.parametrizedEndpoint(balance);
    getBlocks = this.parametrizedEndpoint(getBlocks, { count: 1 });
    getBlocksDetailed = this.parametrizedEndpoint(getBlocksDetailed, {
        count: 1
    });

    // Metrics
    metrics = this.parametrizedEndpoint(metrics);
    metricsBan = this.endpoint(metricsBan);
    metricsMemory = this.endpoint(metricsMemory);

    // Ecosystems
    getEcosystemName = this.parametrizedEndpoint(getEcosystemName);
    getEcosystemParam = this.parametrizedEndpoint(getEcosystemParam);
    getEcosystemParams = this.parametrizedEndpoint(getEcosystemParams);
    getTable = this.parametrizedEndpoint(getTable);
    getTables = this.parametrizedEndpoint(getTables, { limit: 25, offset: 0 });
    getRow = this.parametrizedEndpoint(getRow, {
        column: 'id',
        columns: [] as string[]
    });
    getRows = this.parametrizedEndpoint(getRows, { columns: [] as string[] });
    getSections = this.parametrizedEndpoint(getSections);
    getAppParams = this.parametrizedEndpoint(getAppParams);

    // Content management
    renderPage = this.parametrizedEndpoint(contentPage, {
        params: {} as ContentParams
    });
    renderMenu = this.parametrizedEndpoint(contentMenu, {
        params: {} as ContentParams
    });
    renderSource = this.parametrizedEndpoint(contentTest, {
        params: {} as ContentParams
    });
    contentHash = this.parametrizedEndpoint(contentHash, {
        params: {} as ContentParams
    });

    authStatus = this.endpoint(authStatus);
    network = this.endpoint(network);
    getUid = this.endpoint(getUid);
    login = this.parametrizedEndpoint(login, {
        ecosystemID: '1',
        roleID: '',
        expiry: 36000,
        isMobile: false
    });
}
