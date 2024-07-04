import { ScryfallCard } from "./scryfall-card-models/scryfall-card.model";
import { ScryfallSet } from "./scryfall-set.model";
import { ScryfallSymbol } from "./scryfall-symbol";

export class Scryfall {
    constructor(
        public timestamp: number,
        public cards: ScryfallCard[],
        public sets: ScryfallSet[],
        public symbols: ScryfallSymbol[],
        public cardTypes: string[],
        public superTypes: string[],
        public artifactTypes: string[],
        public battleTypes: string[],
        public creatureTypes: string[],
        public enchantmentTypes: string[],
        public landTypes: string[],
        public planeswalkerTypes: string[],
        public spellTypes: string[],
        public artists: string[]
    ) {}
}