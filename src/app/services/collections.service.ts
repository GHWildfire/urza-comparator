import { EventEmitter, Injectable } from "@angular/core"
import { UrzaCard } from "../data-models/urza-card.model"
import { Collection } from "../data-models/collection.model"
import { compareOptions, orderOptions, colors, orderOptionDirections } from "../pages/compare-page/compare-page.constants"
import { DexieDBService } from "./dexie-db.service"
import { ScryfallAPIService } from "./scryfall-api.service"
import { CSVService } from "./csv.service"
import { Filters } from "../data-models/filter-models/filters.model"
import { ColorFilter } from "../data-models/filter-models/color-filter.model"

@Injectable({ providedIn: 'root' })
export class CollectionsService {

    // Collections
    collection1?: Collection
    collection2?: Collection
    collection1FromCSV?: Collection
    collection2FromCSV?: Collection
    collectionLinked1?: Collection
    collectionLinked2?: Collection
    collection: Collection = new Collection([], false)

    // Variables
    rightToLeft: boolean = true
    cardWidth: number = 170
    cardSpacing: number = 10
    cardZoom: number = 1
    nbCards: number = 0
    viewportSize: number = 0
    selectedCardIndex: number = 0
    
    // Filters
    filters: Filters = new Filters

    // Header parameters
    nameFilter: string = ""
    compareOptionSelected: number = compareOptions[0].value
    orderOptionSelected: string = orderOptions[0].value

    // Events
    gridUpdated = new EventEmitter<{ grid: UrzaCard[][], cards: UrzaCard[] }>()
    collectionsReady = new EventEmitter<boolean>()
    colorFilterUpdated = new EventEmitter<{ filter: ColorFilter, filterId: string }>()

    constructor(
        private dexieDB: DexieDBService,
        private scryfallAPIService: ScryfallAPIService,
        csvService: CSVService
    ) {
        csvService.csvLoaded.subscribe((result) => {
            if (result.isLeft) {
                this.collection1FromCSV = result.collection
            } else {
                this.collection2FromCSV = result.collection
            }

            if (this.collection1FromCSV && this.collection2FromCSV) {
                this.collectionsReady.emit(true)
            }
        })

        scryfallAPIService.scryfallLoaded.subscribe(() => {
            if (this.collection1 && this.collection2) {
                this.scryfallAPIService.linkScryfallData(this.collection1, true)
                this.scryfallAPIService.linkScryfallData(this.collection2, false)
            }
        })

        scryfallAPIService.collectionLinked.subscribe(result => {
            if (result.isLeft) {
                this.collectionLinked1 = result.collection
            } else {
                this.collectionLinked2 = result.collection
            }

            if (this.collectionLinked1 && this.collectionLinked2) {
                this.dexieDB.saveCollections(this.collection1, this.collection2)
            }
        })
    }

    // -------- Collections header --------

    swap() {
        this.rightToLeft = !this.rightToLeft
        this.mergeCollections()
    }

    // -------- Main filters --------

    updateName(nameFilter: string) {
        this.nameFilter = nameFilter
        this.adaptCardGrid()
    }

    updateCompareOptionSelected(compareOptionSelected: number) {
        this.compareOptionSelected = compareOptionSelected
        this.adaptCardGrid()
    }

    updateOrderOptionSelected(orderOptionSelected: string) {
        this.orderOptionSelected = orderOptionSelected
        this.mergeCollections()
    }

    // -------- Advanced filters --------

    updateFilters(filters: Filters) {
        this.filters = filters
        this.adaptCardGrid()
    }

    // -------- Collections --------

    async getCollection(isLeft: boolean) {
        if (this.collection1 === undefined || this.collection2 === undefined) {
            const collections = await this.dexieDB.collections.toArray()
            if (collections.length == 2) {
                this.collection1 = Collection.fromObject(collections[0])
                this.collection2 = Collection.fromObject(collections[1])
    
                this.mergeCollections()
            }
        }

        return isLeft ? this.collection1 : this.collection2
    }

    mergeCollections() {
        if (this.collection1 === undefined || this.collection2 === undefined) {
            return
        }

        let resultingCollection = new Collection(this.rightToLeft ? this.collection2.cards : this.collection1.cards, false)
        let checkedCollection = new Collection(this.rightToLeft ? this.collection1.cards : this.collection2.cards, false)

        this.collection.cards = resultingCollection.cards.filter(card => {
            return !checkedCollection?.cards.some(card2 => card.id === card2.id)
        })

        this.adaptCardGrid()
    }

    // -------- Adapt display on filter change or collections change --------

    adaptViewportSize(viewportSize: number) {
        this.viewportSize = viewportSize
        this.adaptCardGrid()
    }

    adaptCardZoom(cardZoom: number) {
        this.cardZoom = cardZoom
        this.adaptCardGrid()
    }

    adaptCardGrid() {
        let grid: UrzaCard[][] = []
        let gridRow: UrzaCard[] = []
        let index = 0
        
        let columns = Math.floor(this.viewportSize / (this.cardZoom * this.cardWidth + this.cardSpacing))
        let orderedCards: UrzaCard[] = this.sortCards(this.collection.cards)
        let filteredCards = this.filterCards(orderedCards)

        filteredCards.forEach((card: UrzaCard) => {
            if (index % columns === 0 && index > 0) {
                grid.push(gridRow)
                gridRow = []
            }
            gridRow.push(card)
            index++
        })

        if (gridRow.length > 0) {
            grid.push(gridRow)
        }

        this.nbCards = index
        this.gridUpdated.emit({ grid: grid, cards: filteredCards })
    }

    // -------- Welcome page --------

    clearImportedCollection(isLeft: boolean) {
        if (isLeft) {
            this.collection1 = undefined
        } else {
            this.collection2 = undefined
        }

        this.collectionsReady.emit(false)
    }

    areCollectionsImported() {
        return this.collection1 !== undefined && this.collection2 !== undefined
    }

    lockCollections() {
        this.collection1 = this.collection1FromCSV
        this.collection2 = this.collection2FromCSV
        this.dexieDB.saveCollections(this.collection1, this.collection2)

        if (this.collection1 && this.collection2) {
            this.scryfallAPIService.linkScryfallData(this.collection1, true)
            this.scryfallAPIService.linkScryfallData(this.collection2, false)
        }

        this.mergeCollections()
    }

    // -------- Filtering helpers --------

    private filterCards(cards: UrzaCard[]): UrzaCard[] {
        let rarityFilterOff = true
        for (const [_, value] of Object.entries(this.filters.rarityFilter)) {
            rarityFilterOff = rarityFilterOff && !value
        }

        return cards.filter(card => {
          return card.name.toLowerCase().includes(this.nameFilter.toLowerCase())
            && card.count >= this.compareOptionSelected
            && (rarityFilterOff ? true : this.filterRarity(card) )
            && this.filterColor(this.filters.colorFilter, card, true) 
            && this.filterColor(this.filters.colorUnfilter, card, false)
            && this.filterSets(card)
            && this.filterArtists(card)
            && this.filterTypes(card, this.filters.types)
            && this.filterTypes(card, this.filters.superTypes)
            && this.filterTypes(card, this.filters.artifactTypes)
            && this.filterTypes(card, this.filters.spellTypes)
            && this.filterTypes(card, this.filters.creatureTypes)
            && this.filterTypes(card, this.filters.enchantmentTypes)
            && this.filterTypes(card, this.filters.landTypes)
            && this.filterTypes(card, this.filters.planeswalkerTypes)
            && this.filterTypes(card, this.filters.battleTypes)
        })
    }

    private filterTypes(card: UrzaCard, types: any[]): boolean {
        if (card.type === undefined) return false
        if (types.length === 0) return true

        let result = false
        types.forEach((type) => {
            if (card.type.toLowerCase().includes(type.toLowerCase())) {
                result = true
            }
        })
        return result
    }

    private filterArtists(card: UrzaCard): boolean {
        if (card.author === undefined) return false
        if (this.filters.artists.length === 0) return true

        let result = false
        this.filters.artists.forEach((artist) => {
            if (artist.toLowerCase() === card.author.toLowerCase()) {
                result = true
            }
        })
        return result
    }

    private filterSets(card: UrzaCard): boolean {
        if (card.setCode === undefined) return false
        if (this.filters.sets.length === 0) return true

        let result = false
        this.filters.sets.forEach((set) => {
            if (set.code?.toLowerCase() === card.setCode.toLowerCase()) {
                result = true
            }
        })
        return result
    }

    private filterRarity(card: UrzaCard): boolean {
        if (card.rarity === undefined) return false

        for (const [key, value] of Object.entries(this.filters.rarityFilter)) {
            if (key.toLowerCase() == card.rarity.toLowerCase() && value) {
                return true
            }
        }
        return false
    }

    private filterColor(filter: ColorFilter, card: UrzaCard, include: boolean): boolean {
        if (card.manaCost === undefined) return false

        const checkColor = (color: string, shouldInclude: boolean) => {
            return shouldInclude ? card.manaCost.includes(color) : !card.manaCost.includes(color)
        }

        if (filter.white && !checkColor("W", include)) return false
        if (filter.blue && !checkColor("U", include)) return false
        if (filter.black && !checkColor("B", include)) return false
        if (filter.red && !checkColor("R", include)) return false
        if (filter.green && !checkColor("G", include)) return false
        if (filter.colorless) {
            const colored = ["W", "U", "B", "R", "G"].some(color => card.manaCost.includes(color))
            if ((include && colored) || (!include && !colored)) return false
        }
        if (filter.multicolor) {
            let count = 0
            if (card.manaCost.includes("W")) count++
            if (card.manaCost.includes("U")) count++
            if (card.manaCost.includes("B")) count++
            if (card.manaCost.includes("R")) count++
            if (card.manaCost.includes("G")) count++
            if ((include && count < 2) || (!include && count >= 2)) return false
        }
        if (filter.compleated && !checkColor("P", include)) return false

        return true
    }

    // -------- Sorting helper --------

    private sortCards(cards: UrzaCard[]): UrzaCard[] {
        const [property, order] = this.orderOptionSelected.split('-')
    
        return cards.sort((cardA, cardB) => {
            if (property === 'color') {
                // By Magic color
                const indexA = colors.indexOf(cardA.color)
                const indexB = colors.indexOf(cardB.color)
        
                return order === orderOptionDirections.asc ? indexA - indexB : indexB - indexA
            } else if (property === 'price') {
                // By price
                return order === orderOptionDirections.asc 
                    ? cardA.orderingPrice - cardB.orderingPrice 
                    : cardB.orderingPrice - cardA.orderingPrice
            } else {
                // Otherwise
                let valueA = this.getPropertyValue(cardA, property)
                let valueB = this.getPropertyValue(cardB, property)
            
                // Numbers
                if (!isNaN(Number(valueA)) && !isNaN(Number(valueB))) {
                    valueA = Number(valueA)
                    valueB = Number(valueB)
                    return order === orderOptionDirections.asc ? valueA - valueB : valueB - valueA
                }
            
                // Strings
                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    return order === orderOptionDirections.asc ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
                }
        
                return 0
            }
        })
    }
  
    private getPropertyValue(object: any, path: string): any {
      return path.split('.').reduce((o, p) => o && o[p], object)
    }
}