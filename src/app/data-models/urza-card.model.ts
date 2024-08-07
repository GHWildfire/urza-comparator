import { ScryfallCard } from "./scryfall-models/scryfall-card-models/scryfall-card.model"

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
    scryfallId: string = ""

    backCard?: UrzaCard
    facingUp: boolean = true
    linked: boolean = false
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

    get hasMultipleFaces(): boolean {
      const data = this.scryfallData
      return data !== undefined 
        && data.faces !== undefined
        && data.faces.length > 1
        && data.faces[1].normal !== undefined
    }

    flip(): void {
        this.facingUp = !this.facingUp
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
        return this.scryfallData?.prices && this.scryfallData?.prices.usd ? "$" + this.scryfallData?.prices.usd : "No price found"
    }
    
    get averagePriceFoil(): string {
        return this.scryfallData?.prices && this.scryfallData?.prices.usd_foil 
            ? "$" + this.scryfallData?.prices.usd_foil 
            : this.averagePrice
    }

    get orderingPrice(): number {
        if (!this.scryfallData?.prices) return 0
        if (this.scryfallData?.prices.usd) return +this.scryfallData?.prices.usd
        if (!this.scryfallData?.prices.usd && this.scryfallData?.prices.usd_foil && this.foilCount > 0) return +this.scryfallData?.prices.usd_foil
        return 0
    }
    
    get collectionValue(): string {
        let total = 0
        if (this.scryfallData?.prices && this.scryfallData?.prices.usd) {
            total += (this.count - this.foilCount) * +this.scryfallData?.prices.usd
        }
        if (this.scryfallData?.prices && this.scryfallData?.prices.usd_foil) {
            total += this.foilCount * +this.scryfallData?.prices.usd_foil
        }
        return "$" + total
    }

    get priceTag() {
        let result = "No price found"

        const prices = this.scryfallData?.prices
        if (!prices) {
            return result
        }
    
        const usd = prices.usd
        const usdFoil = prices.usd_foil
    
        if (usd === null && usdFoil === null) {
            return result
        }
    
        result = ""
        if (usd !== null) result = "$" + usd
        if (usd !== null && usdFoil !== null) result += " / "
        if (usdFoil !== null) result += "$" + usdFoil
    
        return result
    }
}