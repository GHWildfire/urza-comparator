import { Injectable } from '@angular/core'
import Dexie from 'dexie'
import { Collection } from '../data-models/collection.model'
import { ScryfallCollection } from '../data-models/scryfall-collection.model'

@Injectable({
  providedIn: 'root'
})
export class DexieDBService extends Dexie {
  collections: Dexie.Table<Collection, number>
  scryfalls: Dexie.Table<ScryfallCollection, number>

  private isSaving: boolean = false

  constructor() {
    super('MyAppDatabase')

    this.version(1).stores({
      collections: '++id, cards, file, cardsLinked',
      scryfalls: '++id, cards, timestamp'
    })

    this.collections = this.table('collections')
    this.scryfalls = this.table('scryfalls')
  }

  async saveCollections(collection1?: Collection, collection2?: Collection) {
    if (!collection1 || !collection2) {
      return
    }

    this.isSaving = true
    try {
        await this.transaction('rw', this.collections, async () => {
            await this.collections.clear()
            await this.collections.put(collection1, 0)
            await this.collections.put(collection2, 1)
        })
    } finally {
        this.isSaving = false
    }
  }

  async saveScryfall(scryfall: ScryfallCollection) {
    if (!scryfall) {
      return
    }

    await this.scryfalls.clear()
    await this.scryfalls.put(scryfall, 0)
  }
}