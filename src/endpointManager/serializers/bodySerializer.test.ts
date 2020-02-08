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

import '../../__mocks__/Blob';
import '../../__mocks__/FormData';
import bodySerializer from './bodySerializer';

describe('Body serializer', () => {
    it('Serializes simple types', () =>
        expect(
            bodySerializer({
                boolType: true,
                stringType: 'QA_STRING',
                numberType: 0xd3adc0de
            })
        ).toMatchObject(
            new URLSearchParams({
                boolType: 'true',
                stringType: 'QA_STRING',
                numberType: (0xd3adc0de).toString(10)
            })
        ));

    it('Serializes arrays', () =>
        expect(
            bodySerializer({
                arrayType: ['QA_STRING', true, 0xd3adc0de]
            })
        ).toMatchObject(
            new URLSearchParams([
                ['arrayType', 'QA_STRING'],
                ['arrayType', 'true'],
                ['arrayType', (0xd3adc0de).toString(10)]
            ])
        ));

    it('Uses string representation of blobs when not using FormData', () =>
        expect(
            bodySerializer({
                blobType: new Blob(['first', 'second', 'third'])
            })
        ).toMatchObject(
            new URLSearchParams({
                blobType: new Blob(['first', 'second', 'third']).toString()
            })
        ));

    it('Serializes simple types using FormData', () => {
        const formData = new FormData();
        formData.append('boolType', 'true');
        formData.append('stringType', 'QA_STRING');
        formData.append('numberType', (0xd3adc0de).toString(10));

        expect(
            bodySerializer(
                {
                    boolType: true,
                    stringType: 'QA_STRING',
                    numberType: 0xd3adc0de
                },
                true
            )
        ).toMatchObject(formData);
    });

    it('Serializes arrays using FormData', () => {
        const formData = new FormData();
        formData.append('arrayType', 'QA_STRING');
        formData.append('arrayType', 'true');
        formData.append('arrayType', (0xd3adc0de).toString(10));

        expect(
            bodySerializer(
                {
                    arrayType: ['QA_STRING', true, 0xd3adc0de]
                },
                true
            )
        ).toMatchObject(formData);
    });

    it('Serializes blobs using FormData', () => {
        const blob = new Blob(['first', 'second', 'third']);
        const formData = new FormData();
        formData.append('blobType', blob);

        expect(
            bodySerializer(
                {
                    blobType: blob
                },
                true
            )
        ).toMatchObject(formData);
    });

    it('Skips null and undefined', () => {
        expect(
            bodySerializer({
                nullValue: null,
                undefinedValue: undefined
            })
        ).toMatchObject({});
    });

    it('Skips inherited properties', () => {
        const proto = {
            boolType: true,
            stringType: 'QA_STRING',
            numberType: 0xd3adc0de
        };

        const value = {
            first: 'QA_FIRST',
            second: 1024,
            third: false
        };

        Object.setPrototypeOf(value, proto);

        expect(bodySerializer(value)).toMatchObject(
            new URLSearchParams({
                first: 'QA_FIRST',
                second: '1024',
                third: 'false'
            })
        );
    });
});
