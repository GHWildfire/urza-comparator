export class CSVCollection {
    constructor(
        public file: File,
        public separator: string,
        public headers: string[],
        public lines: string[],
        public isLeft: boolean
    ) {}
}