import { UrzaCard } from "./urza-card.model"

export class Collection {
    constructor(
        public cards: UrzaCard[],
        public cardsLinked: boolean,
        public file?: File,
    ) {}

    static fromObject(obj: any): Collection {
        const cards = obj.cards.map((card: any) => UrzaCard.fromObject(card))
        return new Collection(cards, obj.cardsLinked, obj.file)
    }
}