/*---------------------------------------------------------------------------------------------
*  Copyright (c) EGAAS S.A. All rights reserved.
*  See LICENSE in the project root for license information.
*--------------------------------------------------------------------------------------------*/

import { toMatchOneOf, toMatchShapeOf } from 'jest-to-match-shape-of';

expect.extend({
    toMatchOneOf,
    toMatchShapeOf
});