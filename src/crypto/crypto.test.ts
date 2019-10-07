/*---------------------------------------------------------------------------------------------
 *  Copyright (c) EGAAS S.A. All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { toUint8Array } from '../convert';
import { CryptoProvider } from './';

export default (impl: string, crypto: CryptoProvider) => {
    describe(`Crypto implmentation ${impl}`, () => {
        it('Should generate valid keys', async () => {
            const keys = await crypto.generateKeyPair();
            expect(keys.privateKey.length).toBe(64);
            expect(keys.publicKey.length).toBe(130);
        });

        it('Should generate deterministic public key', async () => {
            const keys = await crypto.generateKeyPair();
            const publicKey = await crypto.generatePublicKey(keys.privateKey);
            expect(keys.publicKey).toBe(publicKey);
        });

        it('Should validate signature', async () => {
            try {
                const keys = await crypto.generateKeyPair();
                const testData = await toUint8Array('Hello world!');
                const signature = await crypto.sign(testData, keys.privateKey);
                const valid = await crypto.verify(
                    signature,
                    testData,
                    keys.publicKey
                );
                expect(valid).toBeTruthy();
            } catch (e) {
                throw e;
            }
        });

        it('Should have consistent results (20 times mark)', async () => {
            const check = async () => {
                const keys = await crypto.generateKeyPair();
                const testData = await toUint8Array('Hello world!');
                const signature = await crypto.sign(testData, keys.privateKey);
                const valid = await crypto.verify(
                    signature,
                    testData,
                    keys.publicKey
                );
                return valid;
            };

            for (let i = 0; i < 20; i++) {
                expect(check().catch(e => false)).resolves.toBeTruthy();
            }
        });
    });
};

describe('Common tests for Crypto implementations', () => {
    test('Should be used per implementation', () => {});
});
