export class ScryfallBulk {
    constructor(
        public object: string,
        public has_more: boolean,
        public data: ScryfallBulkData[],
    ) {}

    getDownloadUri(dataType: string) {
        let downloadUri = ""
        this.data.forEach((bulkData: ScryfallBulkData) => {
            if (bulkData.type === dataType) {
                downloadUri = bulkData.download_uri
            }
        })
        return downloadUri
    }
}

export class ScryfallBulkData {
    constructor(
        public object: string,
        public id: string,
        public type: string,
        public updated_at: string,
        public uri: string,
        public name: string,
        public description: string,
        public size: number,
        public download_uri: string,
        public content_type: string,
        public content_encoding: string,
    ) {}
}