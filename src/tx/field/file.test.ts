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

import field from './file';

describe('File type', () => {
    it('Should validate compatible types', () => {
        expect(
            field.isCompatible({ name: '', type: '', value: new Uint8Array() })
        ).toBeTruthy();
    });

    it('Should invalidate bad values', () => {
        expect(field.isCompatible({} as any)).toBeFalsy();
        expect(field.isCompatible(null as any)).toBeFalsy();
        expect(field.isCompatible(undefined as any)).toBeFalsy();
    });

    it('Should correctly stringify values', () => {
        expect(
            field.stringify({ Name: '', MimeType: '', Body: new Uint8Array() })
        ).toBe('[BLOB]');
    });

    it('Should parse values correctly', () => {
        expect(
            field({
                name: 'QA_TEST_NAME',
                type: 'QA_TEST_TYPE',
                value: new Uint8Array([4, 8, 15, 16, 23, 42])
            })
        ).toEqual({
            Name: 'QA_TEST_NAME',
            MimeType: 'QA_TEST_TYPE',
            Body: new Uint8Array([4, 8, 15, 16, 23, 42])
        });
    });
});
