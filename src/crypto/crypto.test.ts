/*---------------------------------------------------------------------------------------------
 *  Copyright (c) EGAAS S.A. All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { toUint8Array, toHex } from '../convert';
import { CryptoProvider } from './';

export default (impl: string, crypto: CryptoProvider) => {
    describe(`Crypto implmentation ${impl}`, () => {
        it('Should generate valid SHA256 hashes', async () => {
            const cases = [
                [
                    'Hello World!',
                    '7F83B1657FF1FC53B92DC18148A1D65DFC2D4B1FA3D677284ADDD200126D9069'
                ],
                [
                    '0123456789',
                    '84D89877F0D4041EFB6BF91A16F0248F2FD573E6AF05C19F96BEDB9F882F7882'
                ],
                [
                    '!@#$%^&*()',
                    '95CE789C5C9D18490972709838CA3A9719094BCA3AC16332CFEC0652B0236141'
                ]
            ];

            cases.forEach(async ([input, output]) => {
                const bytes = await toUint8Array(input);
                const digest = await crypto.SHA256(bytes);
                const hash = toHex(digest);
                expect(hash).toBe(output);
            });
        });

        it('Should generate valid SHA512 hashes', async () => {
            const cases = [
                [
                    'Hello World!',
                    '861844D6704E8573FEC34D967E20BCFEF3D424CF48BE04E6DC08F2BD58C729743371015EAD891CC3CF1C9D34B49264B510751B1FF9E537937BC46B5D6FF4ECC8'
                ],
                [
                    '0123456789',
                    'BB96C2FC40D2D54617D6F276FEBE571F623A8DADF0B734855299B0E107FDA32CF6B69F2DA32B36445D73690B93CBD0F7BFC20E0F7F28553D2A4428F23B716E90'
                ],
                [
                    '!@#$%^&*()',
                    '138FAD927473F694C3A02CCA61008E52572BD19CE442F20E139B6F09157B97157FD71946FEDFEC2381B7E33618AFE5F7C24A873ED1EFE416978ACFC434503614'
                ]
            ];

            cases.forEach(async ([input, output]) => {
                const bytes = await toUint8Array(input);
                const digest = await crypto.SHA512(bytes);
                const hash = toHex(digest);
                expect(hash).toBe(output);
            });
        });

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
