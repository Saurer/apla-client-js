import field from './';

export default field<string | string[], string[]>({
    isCompatible: value => {
        return (
            'string' === typeof value ||
            0 === value.filter(l => 'string' !== typeof l).length
        );
    },
    stringify: value => {
        return `[${value.join(',')}]`;
    },
    parse: value => {
        if (Array.isArray(value)) {
            return value;
        } else {
            return [value];
        }
    }
});
