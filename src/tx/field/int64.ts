import field from './';
import { Int64BE } from 'int64-buffer';

export default field<Int64BE | string | number, Int64BE>({
    isCompatible: value => {
        if ('string' === typeof value) {
            const tryValue = parseInt(value, 10);
            return tryValue === tryValue;
        } else {
            return true;
        }
    },
    stringify: value => {
        return value.toString();
    },
    parse: value => {
        if ('string' === typeof value) {
            return new Int64BE(value);
        } else if ('number' === typeof value) {
            return new Int64BE(value);
        } else {
            return value;
        }
    }
});
