import field from './';

export default field<string | number, number>({
    isCompatible: value => {
        if ('string' === typeof value) {
            const tryValue = parseFloat(value);
            return tryValue === tryValue;
        } else {
            return true;
        }
    },
    stringify: value => {
        return String(value);
    },
    parse: value => {
        if ('string' === typeof value) {
            return parseFloat(value);
        } else {
            return value;
        }
    }
});
