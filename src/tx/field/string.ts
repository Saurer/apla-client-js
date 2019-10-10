import field from './';

export default field<string>({
    isCompatible: value => {
        return 0 < value.length;
    },
    stringify: value => {
        return value;
    },
    parse: value => value
});
