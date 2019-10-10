import field from './';

export interface FileStruct {
    name: string;
    type: string;
    value: ArrayBuffer;
}

export interface FileData {
    Name: string;
    MimeType: string;
    Body: ArrayBuffer;
}

export default field<FileStruct, FileData>({
    isCompatible: value => {
        return value && 'object' === typeof value && 'value' in value;
    },
    stringify: () => {
        return '[BLOB]';
    },
    parse: value => ({
        Name: value.name,
        MimeType: value.type,
        Body: value.value
    })
});
