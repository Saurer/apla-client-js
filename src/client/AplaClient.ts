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
import { toUint8Array, toHex } from '../convert';
import crypto from '../crypto';
import ContractService, {
    ContractServiceOptions
} from '../services/ContractService';
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
import keyInfo from '../endpoint/defs/keyInfo';
import getContracts from '../endpoint/defs/getContracts';
import txExec from '../endpoint/defs/txExec';
import txStatus from '../endpoint/defs/txStatus';
import getContract from '../endpoint/defs/getContract';

export interface AplaClientOptions extends Partial<ApiOptions> {
    session?: SessionContainer;
    contractOptions?: ContractServiceOptions;
}

export interface SessionContainer {
    token: string;
    networkID: number;
    ecosystem: string;
    role?: string;
}

const defaultTransport: RequestTransport =
    'undefined' !== typeof window && 'fetch' in window
        ? (url, init) => window.fetch(url, init)
        : () => {
              throw new MissingTransportError();
          };

const defaultOptions = {
    apiEndpoint: '/api/v2',
    transport: defaultTransport,
    txMaxRetries: 30
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
                    Authorization: `Bearer ${options.session.token}`
                })
            },
            middleware: [...defaultMiddleware, ...(options.middleware || [])]
        });

        this.contracts = new ContractService(this, {
            ...options.contractOptions,
            session: options.session!
        });
    }

    // Service endpoints
    version = this.endpoint(version);

    // Data getters
    balance = this.parametrizedEndpoint(balance);
    getBlocks = this.parametrizedEndpoint(getBlocks, {
        defaultParams: {
            count: 1
        }
    });
    getBlocksDetailed = this.parametrizedEndpoint(getBlocksDetailed, {
        defaultParams: {
            count: 1
        }
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
    getTables = this.parametrizedEndpoint(getTables, {
        defaultParams: {
            limit: 25,
            offset: 0
        }
    });
    getRow = this.parametrizedEndpoint(getRow, {
        defaultParams: {
            column: 'id',
            columns: [] as string[]
        }
    });
    getRows = this.parametrizedEndpoint(getRows, {
        defaultParams: {
            columns: [] as string[]
        }
    });
    getSections = this.parametrizedEndpoint(getSections);
    getAppParams = this.parametrizedEndpoint(getAppParams);
    getContracts = this.parametrizedEndpoint(getContracts);
    getContract = this.parametrizedEndpoint(getContract);

    // Content management
    renderPage = this.parametrizedEndpoint(contentPage, {
        defaultParams: {
            params: {} as ContentParams
        }
    });
    renderMenu = this.parametrizedEndpoint(contentMenu, {
        defaultParams: {
            params: {} as ContentParams
        }
    });
    renderSource = this.parametrizedEndpoint(contentTest, {
        defaultParams: {
            params: {} as ContentParams
        }
    });
    contentHash = this.parametrizedEndpoint(contentHash, {
        defaultParams: {
            params: {} as ContentParams
        }
    });

    // Authorization
    authorize = async (
        privateKey: string,
        options?: { ecosystemID?: string; role?: string }
    ) => {
        const loginParams: { ecosystemID: string; role?: string } = {
            ecosystemID: '1',
            ...options
        };
        const uid = await this.getUid();
        const signature = await crypto.sign(
            await toUint8Array(uid.uid),
            privateKey
        );
        const publicKey = await crypto.generatePublicKey(privateKey);

        const loginClient = new AplaClient(this.apiHost, {
            ...this.options,
            session: {
                token: uid.token,
                networkID: uid.networkID,
                ecosystem: ''
            }
        });

        const result = await loginClient.login({
            ...loginParams,
            publicKey,
            signature: toHex(signature)
        });

        return new AplaClient(this.apiHost, {
            ...this.options,
            session: {
                token: result.token,
                networkID: uid.networkID,
                ecosystem: loginParams.ecosystemID,
                role: loginParams.role
            }
        });
    };
    authStatus = this.endpoint(authStatus);
    network = this.endpoint(network);
    getUid = this.endpoint(getUid);
    login = this.parametrizedEndpoint(login, {
        defaultParams: {
            ecosystemID: '1',
            roleID: '',
            expiry: 36000,
            isMobile: false
        }
    });
    keyInfo = this.parametrizedEndpoint(keyInfo);

    // Transactions
    txExec = this.parametrizedEndpoint(txExec, {
        useFormData: true
    });
    txStatus = this.parametrizedEndpoint(txStatus);

    // Services
    contracts: ContractService;
}
