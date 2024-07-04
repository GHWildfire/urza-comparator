import { ScryfallCard } from "./scryfall-card-models/scryfall-card.model"

export class ScryfallCollection {
    constructor(
        public cards: ScryfallCard[],
        public timestamp: number
    ) {}

    static fromJSON(json: any): ScryfallCollection {
        const cards = json.map((cardData: any) => ScryfallCard.fromJSON(cardData))
        return new ScryfallCollection(cards, Date.now())
    }
}