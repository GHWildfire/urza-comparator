import { ScryfallSet } from "../scryfall-models/scryfall-set.model"
import { ColorFilter } from "./color-filter.model"
import { RarityFilter } from "./rarity-filter.model"

export class Filters {
    rarityFilter: RarityFilter = new RarityFilter
    colorFilter: ColorFilter = new ColorFilter
    colorUnfilter: ColorFilter = new ColorFilter
    sets: ScryfallSet[] = []
    artists: string[] = []
    types: string[] = []
    superTypes: string[] = []
    artifactTypes: string[] = []
    spellTypes: string[] = []
    creatureTypes: string[] = []
    enchantmentTypes: string[] = []
    landTypes: string[] = []
    planeswalkerTypes: string[] = []
    battleTypes: string[] = []
}