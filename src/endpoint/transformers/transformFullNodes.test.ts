import transformFullNodes from './transformFullNodes';
import { FullNode } from '../../types/network';

describe('FullNodes transformer', () => {
    it('Should handle key_ud naming mistake', () => {
        const result = transformFullNodes({ key_ud: 128 });
        expect(result).toMatchObject({
            keyID: 128
        });
    });

    it('Should correctly transform input value', () => {
        const result = transformFullNodes({
            key_ud: '256',
            public_key: 'qa_pkey',
            stopped: true,
            tcp_address: '::1',
            api_address: 'qa/test/api'
        });

        expect(result).toMatchObject<FullNode>({
            keyID: '256',
            publicKey: 'qa_pkey',
            stopped: true,
            tcpAddress: '::1',
            apiAddress: 'qa/test/api'
        });
    });
});

export default transformFullNodes;
