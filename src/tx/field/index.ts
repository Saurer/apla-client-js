interface FieldMethods<TInput, TOutput> {
    isCompatible: (value: TInput) => boolean;
    stringify: (value: TOutput) => string;
}

interface FieldProcessor<TInput, TOutput> {
    (value: TInput): TOutput;
}

export type Field<TInput, TOutput> = FieldMethods<TInput, TOutput> &
    FieldProcessor<TInput, TOutput>;

export default function<TInput = object, TOutput = TInput>(
    params: FieldMethods<TInput, TOutput> & {
        parse: FieldProcessor<TInput, TOutput>;
    }
) {
    return Object.assign(
        (value: TInput) => {
            return params.parse(value);
        },
        {
            isCompatible: params.isCompatible,
            stringify: params.stringify
        }
    ) as Field<TInput, TOutput>;
}
