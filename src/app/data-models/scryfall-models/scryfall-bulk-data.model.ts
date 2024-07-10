export class ScryfallBulkData {
    constructor(
        public object?: string,
        public id?: string,
        public type?: string,
        public updated_at?: string,
        public uri?: string,
        public name?: string,
        public description?: string,
        public size?: number,
        public download_uri?: string,
        public content_type?: string,
        public content_encoding?: string,
    ) {}

    static fromObject(json: any): ScryfallBulkData {
        return new ScryfallBulkData(
            json?.object,
            json?.id,
            json?.type,
            json?.updated_at,
            json?.uri,
            json?.name,
            json?.description,
            json?.size,
            json?.download_uri,
            json?.content_type,
            json?.content_encoding
        )
    }
}