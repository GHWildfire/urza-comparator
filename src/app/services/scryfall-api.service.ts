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

@Injectable({ providedIn: 'root' })
export class ScryfallAPIService {
    private scryFallURL: string = "https://api.scryfall.com"
    private scryfallBulkDataType: string = "default_cards"
    private scryfall?: Scryfall
    private scryfallMinRefreshFrequency: number = 0//1000 * 60 * 10 // 10 minutes
    private linkingBatchSize: number = 20

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
            const scryfall = scryfalls[0]
            const currentTime = new Date().getTime()
            if (currentTime - scryfall.timestamp > this.scryfallMinRefreshFrequency) {
                this.loadScryfall()
            } else {
                this.scryfall = scryfall
                this.scryfallLoaded.emit(this.scryfall)
            }
        } else {
            this.loadScryfall()
        }
    }

    loadScryfall() {
        this.getScryfall().subscribe((scryfall) => {
            this.scryfall = scryfall
            this.scryfallLoaded.emit(this.scryfall)
        })
    }

    // Get scryfall data by calling all required requests
    getScryfall(): Observable<Scryfall> {
        return forkJoin({
          cards: this.getCards(),
          sets: this.getSets()
        }).pipe(
          map(results => {
            return new Scryfall(new Date().getTime(), results.cards, results.sets)
          }),
          catchError((error: any) => {
            console.error('An error occurred while loading Scryfall data:', error)
            return throwError(() => new Error('Something went wrong please try again later.'))
          })
        )
    }

    // Get all sets [example: Commander Master Set]
    getSets(): Observable<ScryfallSet[]> {
        return this.http.get<any>(this.scryFallURL + "/sets").pipe(
            map(responseData => responseData.data.map((setJson: any) => ScryfallSet.fromJSON(setJson)))
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
                        const cards = responseData.map((card: any) => ScryfallCard.fromJSON(card))
                        //this.db.saveScryfall(scryfall)
                        return cards
                    })
                )
            })
        )
    }
   
    // Get bulk data containg only th desired type [example: default_cards]
    getBulkData(): Observable<ScryfallBulkData | undefined> {
        return this.http.get<any>(this.scryFallURL + "/bulk-data").pipe(
            map(responseData => {
                const bulkDatas = responseData.data.map((bulkDataJson: any) => ScryfallBulkData.fromJSON(bulkDataJson))
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

    // Get a catalog of ressources [example: card-types]
    getCatalog(catalogUri: string): Observable<string[]> {
        return this.http.get<any>(this.scryFallURL + "/catalog/" + catalogUri).pipe(
            map(responseData => ScryfallCatalog.fromJSON(responseData).data ?? [])
        )
    }
    
    async linkScryfallData(collection: Collection, isLeft: boolean) {
        if (!this.scryfall || !this.scryfall.cards || collection.cardsLinked) {
            return
        }
    
        // Dictionary for rapid access
        const scryfallCardMap: { [id: string]: ScryfallCard } = {}
        for (const card of this.scryfall.cards) {
            scryfallCardMap[card.id] = card
        }
    
        // Link batches process
        const linkCardBatch = async (startIndex: number, endIndex: number) => {
            for (let i = startIndex; i < endIndex; i++) {
                const card = collection.cards[i]
                card.scryfallData = scryfallCardMap[card.scryfallId]
                card.linked = true
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
    
        // Linking finished signals
        collection.cardsLinked = true
        this.collectionLinking.emit({ progress: totalCards, isLeft: isLeft })
        this.collectionLinked.emit({ collection: collection, isLeft: isLeft })
    }
}