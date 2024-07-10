export class ScryfallCardPurchaseUris {
    constructor(
        public tcgplayer?: string,
        public cardmarket?: string,
        public cardhoarder?: string,
    ) {}

    static fromObject(json: any): ScryfallCardPurchaseUris {
        return new ScryfallCardPurchaseUris(
            json?.tcgplayer,
            json?.cardmarket,
            json?.cardhoarder
        )
    }
}