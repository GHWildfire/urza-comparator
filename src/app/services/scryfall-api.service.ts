import { HttpClient } from "@angular/common/http"
import { EventEmitter, Injectable } from "@angular/core"
import { Collection } from "../data-models/collection.model"
import { ScryfallBulk, ScryfallBulkData } from "../data-models/scryfall-bulk.model"
import { Observable, map, switchMap } from "rxjs"
import { ScryfallCard, ScryfallCollection, createScryfallCard } from "../data-models/scryfall-collection.model"
import { DexieDBService } from "./dexie-db.service"

@Injectable({ providedIn: 'root' })
export class ScryfallAPIService {
    private scryFallURL: string = "https://api.scryfall.com"
    private scryfallBulkDataType: string = "default_cards"
    private scryfallCollection?: ScryfallCollection
    private scryfallMinRefreshFrequency: number = 1000 * 60 * 10 // 10 minutes

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
        this.getScryfallCollection().subscribe((collection: ScryfallCollection) => {
            this.scryfallCollection = collection
            this.scryfallLoaded.emit(collection)
        })
    }

    getScryfallCollection(): Observable<ScryfallCollection> {
        return this.getBulkData().pipe(
            switchMap((bulk: ScryfallBulk) => {
                const downloadUri = bulk.getDownloadUri(this.scryfallBulkDataType);
                return this.http.get<any>(downloadUri).pipe(
                    map(responseData => {
                        const cards = responseData.map((cardData: any) => createScryfallCard(cardData));
                        const scryfall = new ScryfallCollection(cards, new Date().getTime());
                        this.db.saveScryfall(scryfall);
                        return scryfall;
                    })
                );
            })
        );
    }
   
    getBulkData(): Observable<ScryfallBulk> {
        return this.http.get<any>(this.scryFallURL + "/bulk-data").pipe(
            map(responseData => {
                const datas: ScryfallBulkData[] = responseData.data.map((bulkData: any) => new ScryfallBulkData(
                    bulkData.object,
                    bulkData.id, 
                    bulkData.type,
                    bulkData.updated_at,
                    bulkData.uri,
                    bulkData.name,
                    bulkData.description,
                    bulkData.size,
                    bulkData.download_uri,
                    bulkData.content_type,
                    bulkData.content_encoding
                ))
                    
                return new ScryfallBulk(responseData.object, responseData.has_more, datas)
            })
        );
    }

    async linkScryfallData(collection: Collection, isLeft: boolean) {
        if (!this.scryfallCollection || collection.cardsLinked) {
            return
        }
        
        const batchSize = 20
        const cards = this.scryfallCollection.cards
        let index = 0

        for (const card of collection.cards) {
            card.scryfallData = cards.find((c: any) => c.id === card.scryfallId)

            if (index % batchSize === 0) {
                this.collectionLinking.emit({ progress: index, isLeft: isLeft })
                await new Promise(f => setTimeout(f, 0));
            }

            index = index + 1
        }

        collection.cardsLinked = true
        this.collectionLinking.emit({ progress: index, isLeft: isLeft })
        this.collectionLinked.emit({ collection: collection, isLeft: isLeft })
    }
}