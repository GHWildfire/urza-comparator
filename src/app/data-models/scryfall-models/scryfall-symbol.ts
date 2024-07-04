export class ScryfallSymbol {
    constructor(
        public object?: string,
        public symbol?: string,
        public svg_uri?: string,
        public loose_variant?: string,
        public english?: string,
        public transposable?: boolean,
        public represents_mana?: boolean,
        public appears_in_mana_costs?: boolean,
        public mana_value?: number,
        public hybrid?: boolean,
        public phyrexian?: boolean,
        public cmc?: number,
        public funny?: boolean,
        public colors?: string[],
        public gatherer_alternates?: string[]
    ) {}

    static fromJSON(json: any): ScryfallSymbol {
        return new ScryfallSymbol(
            json?.object,
            json?.symbol,
            json?.svg_uri,
            json?.loose_variant,
            json?.english,
            json?.transposable,
            json?.represents_mana,
            json?.appears_in_mana_costs,
            json?.mana_value,
            json?.hybrid,
            json?.phyrexian,
            json?.cmc,
            json?.funny,
            json?.colors,
            json?.gatherer_alternates
        )
    }
}