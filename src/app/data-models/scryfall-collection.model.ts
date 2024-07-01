export class ScryfallCollection {
    constructor(
        public cards: ScryfallCard[],
        public timestamp: number
    ) {}
}

export class ScryfallCard {
    constructor(
        public object: string,
        public id: string,
        public oracle_id: string,
        public multiverse_ids: string[],
        public mtgo_id: string,
        public tcgplayer_etched_id: string,
        public cardmarket_id: string,
        public name: string,
        public lang: string,
        public released_at: string,
        public uri: string,
        public uscryfall_uri: string,
        public layout: string,
        public highres_image: boolean,
        public image_uris: ScryfallCardImage,
        public mana_cost: string,
        public cmc: string,
        public type_line: string,
        public oracle_text: string,
        public power: string,
        public toughness: string,
        public colors: string[],
        public color_identity: string[],
        public keywords: string[],
        public legalities: ScryfallCardLegalities,
        public games: string[],
        public reserved: boolean,
        public foil: boolean,
        public nonfoil: boolean,
        public finishes: string[],
        public oversized: boolean,
        public promo: boolean,
        public reprint: boolean,
        public variation: boolean,
        public set_id: string,
        public set: string,
        public set_name: string,
        public set_type: string,
        public set_uri: string,
        public set_search_uri: string,
        public scryfall_set_uri: string,
        public rulings_uri: string,
        public prints_search_uri: string,
        public collector_number: string,
        public digital: boolean,
        public rarity: string,
        public card_back_id: string,
        public artist: string,
        public artist_ids: string[],
        public illustration_id: string,
        public border_color: string,
        public frame: string,
        public frame_effects: string[],
        public security_stamp: string,
        public full_art: boolean,
        public textless: boolean,
        public booster: boolean,
        public story_spotlight: boolean,
        public promo_types: string[],
        public edhrec_rank: string,
        public prices: ScryfallCardPrice,
        public related_uris: ScryfallCardRelatedUris,
        public purchase_uris: ScryfallCardPurchaseUris,
        public tcgplayer_id: string,
        public faces: ScryfallCardImage[],
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

export class ScryfallCardLegalities {
    constructor(
        public standard: boolean,
        public future: boolean,
        public historic: boolean,
        public timeless: boolean,
        public gladiator: boolean,
        public pioneer: boolean,
        public explorer: boolean,
        public modern: boolean,
        public legacy: boolean,
        public pauper: boolean,
        public vintage: boolean,
        public penny: boolean,
        public commander: boolean,
        public oathbreaker: boolean,
        public standardbrawl: boolean,
        public brawl: boolean,
        public alchemy: boolean,
        public paupercommander: boolean,
        public duel: boolean,
        public oldschool: boolean,
        public premodern: boolean,
        public predh: boolean,
    ) {}
}

export class ScryfallCardPrice {
    constructor(
        public eur: string,
        public eur_foil: string,
        public usd: string,
        public usd_foil: string,
        public usd_etched: string,
        public tix: string,
    ) {}
}

export class ScryfallCardRelatedUris {
    constructor(
        public gatherer: string,
        public tcgplayer_infinite_articles: string,
        public tcgplayer_infinite_decks: string,
        public edhrec: string,
    ) {}
}

export class ScryfallCardPurchaseUris {
    constructor(
        public tcgplayer: string,
        public cardmarket: string,
        public cardhoarder: string,
    ) {}
}

function createScryfallCardImage(imageData: any): ScryfallCardImage {
    return new ScryfallCardImage(
        imageData?.small,
        imageData?.normal,
        imageData?.large,
        imageData?.png,
        imageData?.art_crop,
        imageData?.border_crop,
    );
}

function createScryfallCardLegalities(legalitiesData: any): ScryfallCardLegalities {
    return new ScryfallCardLegalities(
        legalitiesData?.standard,
        legalitiesData?.future,
        legalitiesData?.historic,
        legalitiesData?.timeless,
        legalitiesData?.gladiator,
        legalitiesData?.pioneer,
        legalitiesData?.explorer,
        legalitiesData?.modern,
        legalitiesData?.legacy,
        legalitiesData?.pauper,
        legalitiesData?.vintage,
        legalitiesData?.penny,
        legalitiesData?.commander,
        legalitiesData?.oathbreaker,
        legalitiesData?.standardbrawl,
        legalitiesData?.brawl,
        legalitiesData?.alchemy,
        legalitiesData?.paupercommander,
        legalitiesData?.duel,
        legalitiesData?.oldschool,
        legalitiesData?.premodern,
        legalitiesData?.predh,
    );
}

function createScryfallCardPrice(priceData: any): ScryfallCardPrice {
    return new ScryfallCardPrice(
        priceData?.eur,
        priceData?.eur_foil,
        priceData?.usd,
        priceData?.usd_foil,
        priceData?.usd_etched,
        priceData?.tix,
    );
}

function createScryfallCardRelatedUris(relatedUrisData: any): ScryfallCardRelatedUris {
    return new ScryfallCardRelatedUris(
        relatedUrisData?.gatherer,
        relatedUrisData?.tcgplayer_infinite_articles,
        relatedUrisData?.tcgplayer_infinite_decks,
        relatedUrisData?.edhrec,
    );
}

function createScryfallCardPurchaseUris(purchaseUrisData: any): ScryfallCardPurchaseUris {
    return new ScryfallCardPurchaseUris(
        purchaseUrisData?.tcgplayer,
        purchaseUrisData?.cardmarket,
        purchaseUrisData?.cardhoarder,
    );
}

export function createScryfallCard(cardData: any): ScryfallCard {
    const images = createScryfallCardImage(cardData.image_uris);
    const legalities = createScryfallCardLegalities(cardData.legalities);
    const prices = createScryfallCardPrice(cardData.prices);
    const relatedUris = createScryfallCardRelatedUris(cardData.related_uris);
    const purchaseUris = createScryfallCardPurchaseUris(cardData.purchase_uris);

    let faces: ScryfallCardImage[] = [];
    if (cardData.card_faces) {
        faces = cardData.card_faces.map((faceData: any) => createScryfallCardImage(faceData.image_uris));
    }

    return new ScryfallCard(
        cardData.object,
        cardData.id,
        cardData.oracle_id,
        cardData.multiverse_ids,
        cardData.mtgo_id,
        cardData.tcgplayer_etched_id,
        cardData.cardmarket_id,
        cardData.name,
        cardData.lang,
        cardData.released_at,
        cardData.uri,
        cardData.uscryfall_uri,
        cardData.layout,
        cardData.highres_image,
        images,
        cardData.mana_cost,
        cardData.cmc,
        cardData.type_line,
        cardData.oracle_text,
        cardData.power,
        cardData.toughness,
        cardData.colors,
        cardData.color_identity,
        cardData.keywords,
        legalities,
        cardData.games,
        cardData.reserved,
        cardData.foil,
        cardData.nonfoil,
        cardData.finishes,
        cardData.oversized,
        cardData.promo,
        cardData.reprint,
        cardData.variation,
        cardData.set_id,
        cardData.set,
        cardData.set_name,
        cardData.set_type,
        cardData.set_uri,
        cardData.set_search_uri,
        cardData.scryfall_set_uri,
        cardData.rulings_uri,
        cardData.prints_search_uri,
        cardData.collector_number,
        cardData.digital,
        cardData.rarity,
        cardData.card_back_id,
        cardData.artist,
        cardData.artist_ids,
        cardData.illustration_id,
        cardData.border_color,
        cardData.frame,
        cardData.frame_effects,
        cardData.security_stamp,
        cardData.full_art,
        cardData.textless,
        cardData.booster,
        cardData.story_spotlight,
        cardData.promo_types,
        cardData.edhrec_rank,
        prices,
        relatedUris,
        purchaseUris,
        cardData.tcgplayer_id,
        faces,
    );
}
