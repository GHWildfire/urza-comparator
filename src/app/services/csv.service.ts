import { EventEmitter, Injectable } from "@angular/core"
import { UrzaCard } from "../data-models/urza-card.model"
import { Collection } from "../data-models/collection.model"
import { CSVCollection } from "../data-models/csv-collection.model"

@Injectable({ providedIn: 'root' })
export class CSVService {
    csvLoading = new EventEmitter<{ progress: number, isLeft: boolean }>()
    csvLoaded = new EventEmitter<{ collection: Collection, isLeft: boolean }>()

    private batchSize: number = 100
    
    async csvToCollection(csvCollection: CSVCollection) {
        let cards: UrzaCard[] = []
        let cardMap: { [id: string]: UrzaCard } = {}

        // Remove spaces in headers
        csvCollection.headers = csvCollection.headers.map((header) => {
            return header.replaceAll(" ", "").toLowerCase()
        })

        // Process each CSV line
        for (let i = 0; i < csvCollection.lines.length; i++) {

            // Construct card
            let card = new UrzaCard(
                csvCollection.headers,
                csvCollection.lines[i].split(new RegExp(`${csvCollection.separator}(?!\\s)`))
            )

            // Detect backfaces or new cards
            const scryfallId = card.scryfallId
            if (scryfallId in cardMap) {
                if (card.id < cardMap[scryfallId].id) {
                    const previousCard = UrzaCard.fromObject(cardMap[scryfallId])
                    cardMap[scryfallId] = card
                    cardMap[scryfallId].backCard = previousCard
                    
                    const index = cards.findIndex(c => c.scryfallId === scryfallId)
                    if (index !== -1) {
                        cards[index] = card
                    }
                } else {
                    cardMap[scryfallId].backCard = card
                }
            } else {
                cards.push(card)
                cardMap[scryfallId] = card
            }

            // Send progress
            if (i % this.batchSize === 0) {
                this.csvLoading.emit({
                    progress: Math.round(100 * i / csvCollection.lines.length),
                    isLeft: csvCollection.isLeft
                })
                await new Promise(f => setTimeout(f, 0))
            }
        }

        // Send result
        const newCollection: Collection = new Collection(cards, false, csvCollection.file)
        this.csvLoading.emit({ progress: 100, isLeft: csvCollection.isLeft })
        this.csvLoaded.emit({ collection: newCollection, isLeft: csvCollection.isLeft })
    }
}