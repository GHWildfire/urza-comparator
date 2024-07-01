import { EventEmitter, Injectable } from "@angular/core";
import { UrzaCard } from "../data-models/urza-card.model";
import { Collection } from "../data-models/collection.model";
import { CSVCollection } from "../data-models/csv-collection.model";

@Injectable({ providedIn: 'root' })
export class CSVService {

    csvLoading = new EventEmitter<{ progress: number, isLeft: boolean }>()
    csvLoaded = new EventEmitter<{ collection: Collection, isLeft: boolean }>()
    
    async csvToCollection(csvCollection: CSVCollection) {
        let cards: UrzaCard[] = []

        csvCollection.headers = csvCollection.headers.map((header) => {
            return header.replaceAll(" ", "").toLowerCase()
        })

        const batchSize = 100
        for (let i = 0; i < csvCollection.lines.length; i++) {
            cards.push(new UrzaCard(csvCollection.headers, csvCollection.lines[i].split(new RegExp(`${csvCollection.separator}(?!\\s)`))))
            if (i % batchSize === 0) {
                this.csvLoading.emit({ progress: Math.round(100 * i / csvCollection.lines.length), isLeft: csvCollection.isLeft })
                await new Promise(f => setTimeout(f, 0));
            }
        }

        const newCollection: Collection = new Collection(cards, false, csvCollection.file)

        this.csvLoading.emit({ progress: 100, isLeft: csvCollection.isLeft })
        this.csvLoaded.emit({ collection: newCollection, isLeft: csvCollection.isLeft })
    }
}