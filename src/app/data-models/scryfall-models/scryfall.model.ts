import { ScryfallCard } from "./scryfall-card-models/scryfall-card.model";
import { ScryfallSet } from "./scryfall-set.model";

export class Scryfall {
    constructor(
        public timestamp: number,
        public cards: ScryfallCard[],
        public sets: ScryfallSet[]
    ) {}
}