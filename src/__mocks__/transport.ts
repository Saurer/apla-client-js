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

export default () => {
    const responses: {
        value: (url: string, request: any) => any;
        ok: boolean;
    }[] = [];

    const transport = jest.fn((url: string, input: any) => {
        const response = responses.pop()!;
        const data = response.value(url, input);
        const mockResponse = {
            clone: () => mockResponse,
            text: () => JSON.stringify(data),
            json: () => data,
            status: response.ok ? 0 : data,
            ok: response.ok
        };

        return Promise.resolve(mockResponse) as any;
    });

    return Object.assign(transport, {
        pushResponse: (value: (url: string, request: any) => any, ok = true) =>
            void responses.push({
                value,
                ok
            })
    });
};
