import field from './';
import { toMoney } from '../../convert';

export default field<string>({
    isCompatible: value => {
        const tryValue = parseFloat(value);
        return tryValue === tryValue;
    },
    stringify: value => {
        return String(value);
    },
    parse: value => toMoney(value) || ''
});
