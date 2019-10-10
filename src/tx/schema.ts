import bool from './field/bool';
import integer from './field/int64';
import float from './field/float';
import money from './field/money';
import string from './field/string';
import file from './field/file';
import stringCollection from './field/stringCollection';

export default {
    header: new Uint8Array([0x80]),
    fields: {
        bool: bool,
        int: integer,
        float: float,
        money: money,
        string: string,
        file: file,
        array: stringCollection
    }
};
