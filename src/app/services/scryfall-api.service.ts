import { HttpClient } from "@angular/common/http"
import { EventEmitter, Injectable } from "@angular/core"
import { Collection } from "../data-models/collection.model"
import { ScryfallBulk } from "../data-models/scryfall-models/scryfall-bulk.model"
import { Observable, map, switchMap } from "rxjs"
import { DexieDBService } from "./dexie-db.service"
import { ScryfallCollection } from "../data-models/scryfall-models/scryfall-collection.model"
import { ScryfallCard } from "../data-models/scryfall-models/scryfall-card-models/scryfall-card.model"

@Injectable({ providedIn: 'root' })
export class ScryfallAPIService {
    private scryFallURL: string = "https://api.scryfall.com"
    private scryfallBulkDataType: string = "default_cards"
    private scryfallCollection?: ScryfallCollection
    private scryfallMinRefreshFrequency: number = 0//1000 * 60 * 10 // 10 minutes
    private linkingBatchSize: number = 20

    scryfallLoaded = new EventEmitter<ScryfallCollection>()
    collectionLinking = new EventEmitter<{ progress: number, isLeft: boolean }>()
    collectionLinked = new EventEmitter<{ collection: Collection, isLeft: boolean }>()

    cards: ScryfallCard[] = []

    constructor(
        private http: HttpClient,
        private db: DexieDBService
    ) {
        this.initScryfallCollection()
    }

    async initScryfallCollection() {
        const scryfalls = await this.db.scryfalls.toArray()
        if (scryfalls.length == 1) {
            const scryfall = scryfalls[0]
            const currentTime = new Date().getTime()
            if (currentTime - scryfall.timestamp > this.scryfallMinRefreshFrequency) {
                this.loadScryfallCollection()
            } else {
                this.scryfallCollection = scryfall
                this.scryfallLoaded.emit(scryfall)
            }
        } else {
            this.loadScryfallCollection()
        }
    }

    loadScryfallCollection() {
        this.getScryfallCards().subscribe((collection: ScryfallCollection) => {
            this.scryfallCollection = collection
            this.scryfallLoaded.emit(collection)
        })
    }
   
    // Bulk data containg all types of global collections
    getBulkData(): Observable<ScryfallBulk> {
        return this.http.get<any>(this.scryFallURL + "/bulk-data").pipe(
            map(responseData => ScryfallBulk.fromJSON(responseData))
        );
    }

    // Get all cards defined by the scryfallBulkDataType selected
    getScryfallCards(): Observable<ScryfallCollection> {
        return this.getBulkData().pipe(
            switchMap((bulk: ScryfallBulk) => {
                const downloadUri = bulk.getDownloadUri(this.scryfallBulkDataType);
                return this.http.get<any>(downloadUri).pipe(
                    map(responseData => {
                        const scryfall = ScryfallCollection.fromJSON(responseData);
                        this.db.saveScryfall(scryfall);
                        return scryfall;
                    })
                );
            })
        );
    }
    
    async linkScryfallData(collection: Collection, isLeft: boolean) {
        if (!this.scryfallCollection || collection.cardsLinked) {
            return
        }
    
        // Dictionary for rapid access
        const scryfallCardMap: { [id: string]: ScryfallCard } = {}
        for (const card of this.scryfallCollection.cards) {
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