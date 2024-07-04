export class ScryfallSet {
    constructor(
        public object?: string,
        public id?: string,
        public code?: string,
        public mtgo_code?: string,
        public arena_code?: string,
        public name?: string,
        public uri?: string,
        public scryfall_uri?: number,
        public search_uri?: string,
        public released_at?: string,
        public set_type?: string,
        public card_count?: string,
        public digital?: string,
        public nonfoil_only?: string,
        public foil_only?: string,
        public icon_svg_uri?: string
    ) {}

    static fromJSON(json: any): ScryfallSet {
        return new ScryfallSet(
            json?.object,
            json?.id,
            json?.code,
            json?.mtgo_code,
            json?.arena_code,
            json?.name,
            json?.uri,
            json?.scryfall_uri,
            json?.search_uri,
            json?.released_at,
            json?.set_type,
            json?.card_count,
            json?.digital,
            json?.nonfoil_only,
            json?.foil_only,
            json?.icon_svg_uri
        )
    }
}