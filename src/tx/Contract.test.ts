import Contract from './Contract';
import schema from './schema';
import { publicToID, toUint8Array } from '../convert';
import { Int64BE } from 'int64-buffer';

const DEFAULT_KEY =
    'e5a87a96a445cb55a214edaad3661018061ef2936e63a0a93bdb76eb28251c1f';
const DEFAULT_KEY_PUBLIC =
    '04489347a1205c818d9a02f285faaedd0122a56138e3d985f5e1b4f6a9470f90f692a00a3453771dd7feea388ceb7aefeaf183e299c70ad1aecb7f870bfada3b86';

const testContract = new Contract({
    id: 256,
    ecosystemID: 128,
    networkID: 1024,
    fields: {
        Numeric: 'int',
        Text: 'string'
    }
});

describe('Contract', () => {
    beforeEach(() => {
        Date.now = () => 1111;
    });

    it('Should generate valid hashes', async () => {
        expect(
            (await testContract.sign(DEFAULT_KEY, {
                Numeric: null,
                Text: undefined
            })).hash
        ).toBe(
            '51667F185645DA763447D648CDD534DAE306712CB4E88D39314454C2EC7E2535'
        );

        expect((await testContract.sign(DEFAULT_KEY, {} as any)).hash).toBe(
            '51667F185645DA763447D648CDD534DAE306712CB4E88D39314454C2EC7E2535'
        );

        expect(
            (await testContract.sign(DEFAULT_KEY, {
                Numeric: 4096,
                Text: 'Hello World!'
            })).hash
        ).toBe(
            '6BAAABAD8AE55ADF2CAFF8DE7D4DBC2F31086E9AAC057856D20D3BA87B0462F2'
        );
    });

    it('Should correctly serialize data', async () => {
        const payload = await testContract.sign(DEFAULT_KEY, {
            Numeric: 4096,
            Text: 'Hello World!'
        });

        expect(payload.header).toEqual(schema.header);
        expect(payload.rawBody.Header.KeyID).toEqual(
            new Int64BE(await publicToID(DEFAULT_KEY_PUBLIC))
        );
        expect(payload.rawBody.Header.PublicKey).toEqual(
            await toUint8Array(DEFAULT_KEY_PUBLIC)
        );
        expect(payload).toMatchObject({
            hash:
                '6BAAABAD8AE55ADF2CAFF8DE7D4DBC2F31086E9AAC057856D20D3BA87B0462F2',
            rawBody: {
                Header: {
                    ID: 256,
                    Time: 1111,
                    EcosystemID: 128,
                    NetworkID: 1024
                },
                Params: {
                    Numeric: new Int64BE(4096),
                    Text: 'Hello World!'
                }
            }
        });
    });
});
