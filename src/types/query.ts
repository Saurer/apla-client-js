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

export type Query =
    | {
          [column: string]: Selector;
      }
    | AndOperator
    | OrOperator;

type Selector = SimpleValue | Operator | Array<Operator>;

type SimpleValue = string | number;

type Operator =
    | EqualityOperator
    | NotEqualityOperator
    | InclusionOperator
    | NotInclusionOperator
    | LessThanOperator
    | LessThanOrEqualOperator
    | GreaterThanOperator
    | GreaterThanOrEqualOperator
    | LikeOperator
    | BeginOperator
    | EndOperator
    | InsensitiveLikeOperator
    | InsensitiveBeginOperator
    | InsensitiveEndOperator;

export interface EqualityOperator {
    $eq: SimpleValue;
}

export interface NotEqualityOperator {
    $neq: SimpleValue;
}

export interface InclusionOperator {
    $in: SimpleValue[];
}

export interface NotInclusionOperator {
    $nin: SimpleValue[];
}

export interface LessThanOperator {
    $lt: SimpleValue;
}

export interface LessThanOrEqualOperator {
    $lte: SimpleValue;
}

export interface GreaterThanOperator {
    $gt: SimpleValue;
}

export interface GreaterThanOrEqualOperator {
    $gte: SimpleValue;
}

export interface LikeOperator {
    $like: string;
}

export interface BeginOperator {
    $begin: string;
}

export interface EndOperator {
    $end: string;
}

export interface InsensitiveLikeOperator {
    $ilike: string;
}

export interface InsensitiveBeginOperator {
    $ibegin: string;
}

export interface InsensitiveEndOperator {
    $iend: string;
}

export type Logic = Array<{
    [column: string]: SimpleValue | Operator | Logic | AndOperator | OrOperator;
}>;

export interface AndOperator {
    $and: Logic;
}

export interface OrOperator {
    $or: Logic;
}

export interface DBFind<TValue = {}> {
    where: (query: Query) => this;
    select: (...columns: string[]) => this;
    offset: (value: number) => this;
    limit: (value: number) => this;
    order: (value: string | { [column: string]: -1 | 1 }) => this;
    exec: () => Promise<TValue[]>;
}
