Object.defineProperty(global, 'Blob', {
    value: class {
        public parts: BlobPart[];

        constructor(parts: BlobPart[]) {
            this.parts = parts;
        }
    }
});
