export class ScryfallCollection {
    constructor(
        public cards: ScryfallCard[],
        public timestamp: number
    ) {}
}

export class ScryfallCard {
    constructor(
        public id: string,
        public tcgplayer_id: string,
        public cardmarket_id: string,
        public image_uris: ScryfallCardImage,
        public prices: ScryfallCardPrice,
        public faces: ScryfallCardFace[],
        public released_at: string,
    ) {}
}

export class ScryfallCardFace {
    constructor(
        public image_uris: ScryfallCardImage,
    ) {}
}

export class ScryfallCardImage {
    constructor(
        public small: string,
        public normal: string,
        public large: string,
        public png: string,
        public art_crop: string,
        public border_crop: string,
    ) {}
}

export class ScryfallCardPrice {
    constructor(
        public eur: string,
        public eur_foil: string,
        public usd: string,
        public usd_etched: string,
    ) {}
}