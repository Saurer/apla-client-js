Object.defineProperty(global, 'FormData', {
    value: class {
        private _value = {};

        append(key: string, value: any) {
            if (this._value[key]) {
                this._value[key].push(value);
            } else {
                this._value[key] = [value];
            }
        }
    }
});
