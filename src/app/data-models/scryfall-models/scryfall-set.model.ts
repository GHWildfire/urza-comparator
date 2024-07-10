import { UrzaCard } from "../urza-card.model"

export class ScryfallSet {

    constructor(
        public leftCollectionSubset: UrzaCard[],
        public rightCollectionSubset: UrzaCard[],
        public object?: string,
        public id?: string,
        public code?: string,
        public mtgo_code?: string,
        public arena_code?: string,
        public name?: string,
        public uri?: string,
        public scryfall_uri?: number,
        public search_uri?: string,
        public released_at?: string,
        public set_type?: string,
        public card_count?: string,
        public parent_set_code?: string,
        public digital?: string,
        public nonfoil_only?: string,
        public foil_only?: string,
        public block_code?: string,
        public block?: string,
        public icon_svg_uri?: string,
        public parentLayer?: number,
        public parent_set?: ScryfallSet,
    ) {}

    containsCards(set: ScryfallSet): boolean {
        //const parentcontains = set.parent_set_code ? 
        return (set.leftCollectionSubset.length > 0 || set.rightCollectionSubset.length > 0)
    }

    static fromObject(obj: any): ScryfallSet {
        const leftCollection = obj.leftCollectionSubset ? obj.leftCollectionSubset.map((card: any) => UrzaCard.fromObject(card)) : []
        const rightCollection = obj.rightCollectionSubset ? obj.rightCollectionSubset.map((card: any) => UrzaCard.fromObject(card)) : []
        const parent = obj.parent ? ScryfallSet.fromObject(obj.parent) : undefined

        return new ScryfallSet(
            leftCollection,
            rightCollection,
            obj?.object,
            obj?.id,
            obj?.code,
            obj?.mtgo_code,
            obj?.arena_code,
            obj?.name,
            obj?.uri,
            obj?.scryfall_uri,
            obj?.search_uri,
            obj?.released_at,
            obj?.set_type,
            obj?.card_count,
            obj?.parent_set_code,
            obj?.digital,
            obj?.nonfoil_only,
            obj?.foil_only,
            obj?.block_code,
            obj?.block,
            obj?.icon_svg_uri,
            0,
            parent
        )
    }
}