export class ScryfallCardLegalities {
    constructor(
        public standard?: boolean,
        public future?: boolean,
        public historic?: boolean,
        public timeless?: boolean,
        public gladiator?: boolean,
        public pioneer?: boolean,
        public explorer?: boolean,
        public modern?: boolean,
        public legacy?: boolean,
        public pauper?: boolean,
        public vintage?: boolean,
        public penny?: boolean,
        public commander?: boolean,
        public oathbreaker?: boolean,
        public standardbrawl?: boolean,
        public brawl?: boolean,
        public alchemy?: boolean,
        public paupercommander?: boolean,
        public duel?: boolean,
        public oldschool?: boolean,
        public premodern?: boolean,
        public predh?: boolean,
    ) {}

    static fromObject(json: any): ScryfallCardLegalities {
        return new ScryfallCardLegalities(
            json?.standard,
            json?.future,
            json?.historic,
            json?.timeless,
            json?.gladiator,
            json?.pioneer,
            json?.explorer,
            json?.modern,
            json?.legacy,
            json?.pauper,
            json?.vintage,
            json?.penny,
            json?.commander,
            json?.oathbreaker,
            json?.standardbrawl,
            json?.brawl,
            json?.alchemy,
            json?.paupercommander,
            json?.duel,
            json?.oldschool,
            json?.premodern,
            json?.predh
        )
    }
}