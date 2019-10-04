/*---------------------------------------------------------------------------------------------
 *  Copyright (c) EGAAS S.A. All rights reserved.
 *  See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Interface, Page } from '../../types/interface';

const transformInterface: (response: any) => Interface | Page = response => ({
    // Interface ID is handled incorrectly on the REST API provider. Force cast to string since value is big int
    id: String(response.id),
    name: response.name,
    value: response.value,
    conditions: response.conditions,
    ...(response.menu && { menu: response.menu })
});

export default transformInterface;
