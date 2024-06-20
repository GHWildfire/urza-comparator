import { ScryfallCardPrice } from "./scryfall-collection.model"

export class UrzaCard {
    name: string = ""
    type: string = ""
    color: string = ""
    rarity: string = ""
    author: string = ""
    power: number = 0
    toughness: number = 0
    manaCost: string = ""
    convertedManaCost: number = 0
    count: number = 0
    foilCount: number = 0
    specialFoilCount: number = 0
    price: string = ""
    foilPrice: string = ""
    number: number = 0
    set: string = ""
    setCode: string = ""
    id: number = 0
    multiverseId: number = 0
    comments: string = ""
    toTrade: number = 0
    wanted: number = 0
    condition: string = ""
    grading: string = ""
    language: string = ""
    tcgId: number = 0
    cardMarketId: number = 0
    scryfallId: number = 0

    imageUri: string = "loading"
    releaseDate: string = ""
    prices?: ScryfallCardPrice

    constructor(headers: string[], values: string[]) {
        let index = 0
        for (let key of Object.keys(this)) {
            if (headers[index] === key.toString().toLowerCase()) {
                this[key as keyof this] = values[index] as any
            }
            index++
        }
    }
  }