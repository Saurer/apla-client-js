/*---------------------------------------------------------------------------------------------
 *  Copyright (c) EGAAS S.A. All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export default <TValue, TKey = keyof TValue>(
    array: Array<TValue>,
    key: TKey
) => {
    const keyString = String(key);
    const result: { [name: string]: TValue } = array.reduce((state, value) => {
        const key = value[keyString];
        state[key] = value;
        return state;
    }, {});

    return result;
};
