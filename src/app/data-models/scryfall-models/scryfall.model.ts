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

    static fromObject(obj: any): Scryfall {
        const cards = obj.cards ? obj.cards.map((card: any) => ScryfallCard.fromObject(card)) : []
        const sets = obj.sets ? obj.sets.map((set: any) => ScryfallSet.fromObject(set)) : []
        
        return new Scryfall(
            obj.timestamp,
            cards,
            sets,
            obj.symbols,
            obj.cardTypes,
            obj.superTypes,
            obj.artifactTypes,
            obj.battleTypes,
            obj.creatureTypes,
            obj.enchantmentTypes,
            obj.landTypes,
            obj.planeswalkerTypes,
            obj.spellTypes,
            obj.artists
        );
    }
}