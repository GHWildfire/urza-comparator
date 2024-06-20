import { UrzaCard } from "../data-models/urza-card.model"

export class Collection {
    constructor(
        public cards: UrzaCard[],
        public file?: File
    ) {}
}