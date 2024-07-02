import { ScryfallCard } from "./scryfall-collection.model"

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

    backCard?: UrzaCard
    facingUp: boolean = true
    scryfallData?: ScryfallCard

    constructor(headers: string[], values: string[]) {
        let index = 0
        for (let key of Object.keys(this)) {
            if (headers[index] === key.toString().toLowerCase()) {
                this[key as keyof this] = values[index] as any
            }
            index++
        }
    }

    static fromObject(obj: any): UrzaCard {
        const card = new UrzaCard([], [])
        Object.assign(card, obj)
        return card
    }

    get hasMultipleFaces() {
      const data = this.scryfallData
      return data && data.faces && data.faces.length > 1 && data.faces[1].normal
    }

    get imageUri() {
        let data = this.scryfallData
        if (!data) {
            return "loading"
        }

        if (data.image_uris.normal !== undefined) {
            return data.image_uris.normal
        } else if (data.faces.length > 0) {
            return this.facingUp
              ? data.faces[0].normal
              : data.faces[1].normal
        }

        return "loading"
    }

    get averagePrice(): string {
        return this.scryfallData?.prices && this.scryfallData?.prices.eur ? "€" + this.scryfallData?.prices.eur : "No price found"
    }
    
    get averagePriceFoil(): string {
        return this.scryfallData?.prices && this.scryfallData?.prices.eur_foil 
            ? "€" + this.scryfallData?.prices.eur_foil 
            : this.averagePrice
    }

    get orderingPrice(): number {
        if (!this.scryfallData?.prices) return 0
        if (this.scryfallData?.prices.eur) return +this.scryfallData?.prices.eur
        if (!this.scryfallData?.prices.eur && this.scryfallData?.prices.eur_foil && this.foilCount > 0) return +this.scryfallData?.prices.eur_foil
        return 0
    }
    
    get collectionValue(): string {
        let total = 0
        if (this.scryfallData?.prices && this.scryfallData?.prices.eur) {
            total += (this.count - this.foilCount) * +this.scryfallData?.prices.eur
        }
        if (this.scryfallData?.prices && this.scryfallData?.prices.eur_foil) {
            total += this.foilCount * +this.scryfallData?.prices.eur_foil
        }
        return "€" + total
    }

    get priceTag() {
      let result = "No price found"
  
      const prices = this.scryfallData?.prices
      if (!prices) {
        return result
      }
  
      const euro = prices.eur
      const eurofoil = prices.eur_foil
  
      if (euro === null && eurofoil === null) {
        return result
      }
  
      result = ""
      if (euro !== null) result = "€" + euro
      if (euro !== null && eurofoil !== null) result += " / "
      if (eurofoil !== null) result += "€" + eurofoil
  
      return result
    }
}