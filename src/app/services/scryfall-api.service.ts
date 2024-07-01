import { HttpClient } from "@angular/common/http"
import { EventEmitter, Injectable } from "@angular/core"
import { Collection } from "../data-models/collection.model"
import { ScryfallBulk, ScryfallBulkData } from "../data-models/scryfall-bulk.model"
import { Observable, map, switchMap } from "rxjs"
import { ScryfallCard, ScryfallCardFace, ScryfallCardImage, ScryfallCardPrice, ScryfallCollection } from "../data-models/scryfall-collection.model"
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
                        const cards: ScryfallCard[] = [];
                        responseData.forEach((cardData: any) => {
                            let faces: ScryfallCardFace[] = []
                            if (cardData.card_faces) {
                                faces = cardData.card_faces.map((faceData: any) => new ScryfallCardFace(
                                    new ScryfallCardImage(
                                        faceData.image_uris?.small,
                                        faceData.image_uris?.normal,
                                        faceData.image_uris?.large,
                                        faceData.image_uris?.png,
                                        faceData.image_uris?.art_crop,
                                        faceData.image_uris?.border_crop,
                                    )
                                ))
                            }
    
                            const images = new ScryfallCardImage(
                                cardData.image_uris?.small,
                                cardData.image_uris?.normal,
                                cardData.image_uris?.large,
                                cardData.image_uris?.png,
                                cardData.image_uris?.art_crop,
                                cardData.image_uris?.border_crop,
                            );
    
                            const prices = new ScryfallCardPrice(
                                cardData.prices?.eur,
                                cardData.prices?.eur_foil,
                                cardData.prices?.usd,
                                cardData.prices?.usd_foil,
                            );
                            
                            cards.push(new ScryfallCard(cardData.id, cardData.tcgplayer_id, cardData.cardmarket_id, images, prices, faces, cardData.released_at));
                        });
    
                        const scryfall = new ScryfallCollection(cards, new Date().getTime());
                        this.db.saveScryfall(scryfall)
                        return scryfall
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
        
        const batchSize = 10
        const cards = this.scryfallCollection!.cards
        let index = 0

        for (const card of collection.cards) {
            const matchingCard = cards.find((c: any) => c.id === card.scryfallId)
            card.imageUri = ""

            if (matchingCard) {
                if (matchingCard.image_uris.normal !== undefined) {
                    // Single image cards
                    card.imageUri = matchingCard.image_uris.normal
                } else if (matchingCard.faces.length > 0) {
                    // Multiple faces cards
                    card.imageUri = matchingCard.faces[0].image_uris.normal
                }

                if (card.name.includes("Zhulodok")) {
                    console.log(card)
                }

                card.prices = matchingCard.prices
                card.releaseDate = matchingCard.released_at
            }

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