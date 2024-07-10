import { HttpClient, HttpErrorResponse } from "@angular/common/http"
import { Observable, catchError, forkJoin, map, of, switchMap, throwError } from "rxjs"
import { DexieDBService } from "./dexie-db.service"
import { EventEmitter, Injectable } from "@angular/core"
import { Collection } from "../data-models/collection.model"
import { ScryfallCard } from "../data-models/scryfall-models/scryfall-card-models/scryfall-card.model"
import { ScryfallCatalog } from "../data-models/scryfall-models/scryfall-catalog.model"
import { Scryfall } from "../data-models/scryfall-models/scryfall.model"
import { ScryfallSet } from "../data-models/scryfall-models/scryfall-set.model"
import { ScryfallBulkData } from "../data-models/scryfall-models/scryfall-bulk-data.model"
import { ScryfallSymbol } from "../data-models/scryfall-models/scryfall-symbol"

@Injectable({ providedIn: 'root' })
export class ScryfallAPIService {
    private scryFallURL: string = "https://api.scryfall.com"
    private scryfallBulkDataType: string = "default_cards"
    private scryfallMinRefreshFrequency: number = 1000 * 60 * 10 // 10 minutes
    private linkingBatchSize: number = 20
    scryfall?: Scryfall

    scryfallLoaded = new EventEmitter<Scryfall>()
    collectionLinking = new EventEmitter<{ progress: number, isLeft: boolean }>()
    collectionLinked = new EventEmitter<{ collection: Collection, isLeft: boolean }>()

    cards: ScryfallCard[] = []

    constructor(
        private http: HttpClient,
        private db: DexieDBService
    ) {
        this.initScryfall()
    }

    async initScryfall() {
        const scryfalls = await this.db.scryfalls.toArray()
        if (scryfalls.length == 1) {
            const scryfall = Scryfall.fromObject(scryfalls[0])
            const currentTime = new Date().getTime()
            if (currentTime - scryfall.timestamp > this.scryfallMinRefreshFrequency) {
                this.loadScryfall()
                console.log("Loading completely new")
            } else {
                this.scryfall = scryfall
                console.log("Loaded from DB")
                this.scryfallLoaded.emit(this.scryfall)
            }
        } else {
            this.loadScryfall()
            console.log("Loading completely new because no DB")
        }
    }

    loadScryfall() {
        this.getScryfall().subscribe((scryfall) => {
            this.scryfall = scryfall
            this.db.saveScryfall(this.scryfall)
            this.scryfallLoaded.emit(this.scryfall)
        })
    }

    // Get scryfall data by calling all required requests
    getScryfall(): Observable<Scryfall> {
        return forkJoin({
            cards: this.getCards(),
            sets: this.getSets(),
            symbols: this.getSymbols(),
            cardTypes: this.getCatalog("card-types"),
            superTypes: this.getCatalog("supertypes"),
            artifactTypes: this.getCatalog("artifact-types"),
            battleTypes: this.getCatalog("battle-types"),
            creatureTypes: this.getCatalog("creature-types"),
            enchantmentTypes: this.getCatalog("enchantment-types"),
            landTypes: this.getCatalog("land-types"),
            planeswalkerTypes: this.getCatalog("planeswalker-types"),
            spellTypes: this.getCatalog("spell-types"),
            artists: this.getCatalog("artist-names")
        }).pipe(
            map(results => {
                return new Scryfall(
                    new Date().getTime(), 
                    results.cards, 
                    results.sets, 
                    results.symbols, 
                    results.cardTypes, 
                    results.superTypes, 
                    results.artifactTypes, 
                    results.battleTypes, 
                    results.creatureTypes, 
                    results.enchantmentTypes, 
                    results.landTypes, 
                    results.planeswalkerTypes, 
                    results.spellTypes, 
                    results.artists
                )
            }),
            catchError((error: any) => {
                console.error('An error occurred while loading Scryfall data:', error)
                return throwError(() => new Error('Something went wrong please try again later.'))
            })
        )
    }

    // Get all symbols [example: {W} -> white symbol image]
    getSymbols(): Observable<ScryfallSymbol[]> {
        return this.http.get<any>(this.scryFallURL + "/symbology").pipe(
            map(responseData => responseData.data.map((symbolJson: any) => ScryfallSymbol.fromObject(symbolJson)))
        )
    }

    // Get a catalog of ressources [example: card-types]
    getCatalog(catalogUri: string): Observable<string[]> {
        return this.http.get<any>(this.scryFallURL + "/catalog/" + catalogUri).pipe(
            map(responseData => ScryfallCatalog.fromObject(responseData).data ?? [])
        )
    }

    // Get all sets [example: Commander Master Set]
    getSets(): Observable<ScryfallSet[]> {
        return this.http.get<any>(this.scryFallURL + "/sets").pipe(
            map(responseData => responseData.data.map((setJson: any) => ScryfallSet.fromObject(setJson)))
        )
    }

    // Get all cards [example: Jeweled Lotus Card]
    getCards(): Observable<ScryfallCard[]> {
        return this.getBulkData().pipe(
            switchMap((bulkData: ScryfallBulkData | undefined) => {
                if (!bulkData) {
                    return []
                }
                return this.http.get<any>(bulkData?.download_uri!).pipe(
                    map(responseData => {
                        return responseData.map((card: any) => ScryfallCard.fromObject(card))
                    })
                )
            })
        )
    }
   
    // Get bulk data containg only th desired type [example: default_cards]
    getBulkData(): Observable<ScryfallBulkData | undefined> {
        return this.http.get<any>(this.scryFallURL + "/bulk-data").pipe(
            map(responseData => {
                const bulkDatas = responseData.data.map((bulkDataJson: any) => ScryfallBulkData.fromObject(bulkDataJson))
                const bulkData = bulkDatas.find((bulkData: any) => bulkData.type === this.scryfallBulkDataType)
                if (!bulkData) throw new Error('No bulk data found for the type: ' + this.scryfallBulkDataType)
                return bulkData
            }),
            catchError((error: HttpErrorResponse) => {
                // TODO Affichage d'erreurs
                return of(undefined)
            })
        )
    }
    
    async linkScryfallData(collection: Collection, isLeft: boolean) {
        if (!this.scryfall || !this.scryfall.cards || collection.cardsLinked) {
            return
        }
    
        // Dictionaries for rapid access
        const scryfallCardMap: { [id: string]: ScryfallCard } = {}
        for (const card of this.scryfall.cards) {
            scryfallCardMap[card.id] = card
        }

        const setsMap: { [id: string]: ScryfallSet } = {}
        for (const set of this.scryfall.sets) {
            if (set.code) {
                setsMap[set.code.toLowerCase()] = set
            }

            // Reset set cards links
            if (set && isLeft) {
                set.leftCollectionSubset = []
            } else if (set && !isLeft) {
                set.rightCollectionSubset = []
            }
        }
    
        // Link batches process
        const linkCardBatch = async (startIndex: number, endIndex: number) => {
            for (let i = startIndex; i < endIndex; i++) {

                // Link scryfall Data in Urza cards
                const card = collection.cards[i]
                const scryfallData = scryfallCardMap[card.scryfallId]
                
                card.scryfallData = scryfallData
                card.linked = true

                // Link cards to sets
                if (card.setCode) {
                    const set = setsMap[card.setCode.toLowerCase()]
                    if (set && isLeft) {
                        set.leftCollectionSubset.push(card)
                    } else if (set && !isLeft) {
                        set.rightCollectionSubset.push(card)
                    }
                }
            }
        }
    
        // Link all cards
        const totalCards = collection.cards.length
        for (let i = 0; i < totalCards; i += this.linkingBatchSize) {
            const endIndex = Math.min(i + this.linkingBatchSize, totalCards)
            await linkCardBatch(i, endIndex)
            this.collectionLinking.emit({ progress: endIndex, isLeft: isLeft })
            await new Promise(f => setTimeout(f, 0))
        }

        // Save new scryfall state
        this.db.saveScryfall(this.scryfall)
     
        // Linking finished signals
        collection.cardsLinked = true
        this.collectionLinking.emit({ progress: totalCards, isLeft: isLeft })
        this.collectionLinked.emit({ collection: collection, isLeft: isLeft })
    }
}