/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

export default <TValue, TKey = keyof TValue>(array: Array<TValue>, key: TKey) => {
    const result: { [name: string]: TValue } = {};
    const keyString = String(key);

    for (let value of array) {
        result[value[keyString]] = value;
    }

    return result;
};