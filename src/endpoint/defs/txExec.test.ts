import endpoint from './txExec';
import { EndpointResponseType } from '..';
import Contract from '../../tx/Contract';

async function getTestPayload() {
    const testContact = new Contract({
        id: 256,
        ecosystemID: 128,
        networkID: 1024,
        fields: {
            Numeric: 'int',
            Text: 'string'
        }
    });

    const testPayload = await testContact.sign(
        'e5a87a96a445cb55a214edaad3661018061ef2936e63a0a93bdb76eb28251c1f',
        {
            Numeric: 4096,
            Text: 'Hello World!'
        }
    );

    return testPayload;
}

describe('TxExec', () => {
    it('Must correctly transform response', async () => {
        const testPayload = await getTestPayload();
        expect(
            endpoint.serialize([testPayload]).getResponse(
                {
                    hashes: {
                        [testPayload.hash]: testPayload.hash
                    }
                },
                ''
            )
        ).toMatchObject<EndpointResponseType<typeof endpoint>>([
            testPayload.hash
        ]);
    });

    it('Must correctly pass all expected params', async () => {
        const testPayload = await getTestPayload();

        expect(endpoint.serialize(testPayload).body).toMatchObject({
            [testPayload.hash]: testPayload.body
        });

        expect(endpoint.serialize([testPayload]).body).toMatchObject({
            [testPayload.hash]: testPayload.body
        });
    });
});
