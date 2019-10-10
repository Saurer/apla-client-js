import field from './';

export default field<string | boolean, boolean>({
    isCompatible: value => {
        if ('boolean' === typeof value) {
            return true;
        } else if ('string' === typeof value) {
            return ['true', 'false'].indexOf(value) !== -1;
        } else {
            return false;
        }
    },
    stringify: value => {
        return String(value);
    },
    parse: value => {
        if ('boolean' === typeof value) {
            return value;
        } else {
            return 'true' === value;
        }
    }
});
