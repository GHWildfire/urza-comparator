export class ScryfallCardPurchaseUris {
    constructor(
        public tcgplayer?: string,
        public cardmarket?: string,
        public cardhoarder?: string,
    ) {}

    static fromJSON(json: any): ScryfallCardPurchaseUris {
        return new ScryfallCardPurchaseUris(
            json?.tcgplayer,
            json?.cardmarket,
            json?.cardhoarder
        )
    }
}