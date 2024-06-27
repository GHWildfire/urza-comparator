import { UrzaCard } from "./urza-card.model"

export class Collection {
    constructor(
        public cards: UrzaCard[],
        public cardsLinked: boolean,
        public file?: File
    ) {}
}