import { Injectable } from '@angular/core'
import Dexie from 'dexie'
import { Collection } from './app/collection/collection.model'

@Injectable({
  providedIn: 'root'
})
export class DexieDBService extends Dexie {
  collections: Dexie.Table<Collection, number>

  constructor() {
    super('MyAppDatabase')

    this.version(1).stores({
      collections: '++id, cards, file'
    })

    this.collections = this.table('collections');
  }
}