import cryptoTest from '../crypto.test';
import SubtleCrypto from './SubtleCrypto';
import Crypto from 'node-webcrypto-ossl';

cryptoTest('SubtleCrypto', new SubtleCrypto(new Crypto().subtle));
