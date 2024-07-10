export class ScryfallCardPrices {
    constructor(
        public eur?: string,
        public eur_foil?: string,
        public usd?: string,
        public usd_foil?: string,
        public usd_etched?: string,
        public tix?: string,
    ) {}

    static fromObject(json: any): ScryfallCardPrices {
        return new ScryfallCardPrices(
            json?.eur,
            json?.eur_foil,
            json?.usd,
            json?.usd_foil,
            json?.usd_etched,
            json?.tix
        )
    }
}