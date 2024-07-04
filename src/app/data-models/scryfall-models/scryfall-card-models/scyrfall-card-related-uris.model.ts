export class ScryfallCardRelatedUris {
    constructor(
        public gatherer?: string,
        public tcgplayer_infinite_articles?: string,
        public tcgplayer_infinite_decks?: string,
        public edhrec?: string,
    ) {}

    static fromJSON(json: any): ScryfallCardRelatedUris {
        return new ScryfallCardRelatedUris(
            json?.gatherer,
            json?.tcgplayer_infinite_articles,
            json?.tcgplayer_infinite_decks,
            json?.edhrec
        )
    }
}