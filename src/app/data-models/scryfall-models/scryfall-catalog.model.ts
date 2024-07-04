export class ScryfallCatalog {
    constructor(
        public object?: string,
        public uri?: string,
        public total_values?: number,
        public data?: string[]
    ) {}

    static fromJSON(json: any): ScryfallCatalog {
        return new ScryfallCatalog(
            json?.object,
            json?.uri,
            json?.total_values,
            json?.data
        )
    }
}