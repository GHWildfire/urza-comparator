export class ScryfallBulk {
    constructor(
        public object: string,
        public has_more: boolean,
        public data: ScryfallBulkData[],
    ) {}

    getDownloadUri(dataType: string): string {
        let downloadUri = ""
        this.data.forEach((bulkData: ScryfallBulkData) => {
            if (bulkData.type === dataType) {
                downloadUri = bulkData.download_uri
            }
        })
        return downloadUri
    }

    static fromJSON(json: any): ScryfallBulk {
        return new ScryfallBulk(
            json.object,
            json.has_more,
            json.data.map((data: any) => ScryfallBulkData.fromJSON(data))
        )
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

    static fromJSON(json: any): ScryfallBulkData {
        return new ScryfallBulkData(
            json.object,
            json.id,
            json.type,
            json.updated_at,
            json.uri,
            json.name,
            json.description,
            json.size,
            json.download_uri,
            json.content_type,
            json.content_encoding
        )
    }
}
