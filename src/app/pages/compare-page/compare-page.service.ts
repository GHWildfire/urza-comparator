import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable, OnInit } from "@angular/core";
import { Collection } from "../../collection/collection.model";
import { Router } from "@angular/router";
import { ColorFilter } from "./filters/color-filter/color-filter.model";
import { UrzaCard } from "../../data-models/urza-card.model";
import { DexieDBService } from "../../../dexie-db.service";
import { RarityFilter } from "./filters/rarity-filter/rarity-filter.model";

@Injectable({ providedIn: 'root' })
export class ComparePageService {

    collection1?: Collection
    collection2?: Collection

    rightToLeft: boolean = true

    // Filters
    nameFilter: string = ""
    colorFilter: ColorFilter = new ColorFilter
    colorUnfilter: ColorFilter = new ColorFilter
    rarityFilter: RarityFilter = new RarityFilter

    resultingCollectionUpdated = new EventEmitter<Collection>()

    constructor(
        private http: HttpClient, 
        private router: Router,
        private dexieDB: DexieDBService
    ) {}

    transferCollections(collection1: Collection, collection2: Collection) {
        this.collection1 = collection1
        this.collection2 = collection2

        this.saveCollection()
    }

    async saveCollection() {
        if (!this.collection1 || !this.collection2) {
            return
        }

        await this.dexieDB.collections.clear();

        this.dexieDB.collections.put(this.collection1, 0)
        this.dexieDB.collections.put(this.collection2, 1)
    }

    async loadCollections() {
        const collections = await this.dexieDB.collections.toArray();
        if (collections.length == 2) {
            this.collection1 = collections[0]
            this.collection2 = collections[1]
        }
    }

    swap() {
        this.rightToLeft = !this.rightToLeft
        this.updateResultingCollection()
    }

    update() {
        this.updateResultingCollection()
    }

    updateColors(colorFilter: ColorFilter, contains: boolean) {
        if (contains) {
            this.colorFilter = colorFilter
        } else {
            this.colorUnfilter = colorFilter
        }
        this.updateResultingCollection()
    }

    updateName(nameFilter: string) {
        this.nameFilter = nameFilter
        this.updateResultingCollection()
    }

    updateRarities(rarityFilter: RarityFilter) {
        this.rarityFilter = rarityFilter
        this.updateResultingCollection()
    }

    async getCollection(detailsId: string) {
        if (this.collection1 === undefined || this.collection2 === undefined) {
            await this.loadCollections()
        }

        this.updateResultingCollection()

        if (detailsId === "Details 1") {
            return this.collection1
        } else {
            return this.collection2
        }
    }

    updateResultingCollection() {
        if (this.collection1 === undefined || this.collection2 === undefined) {
            return
        }

        // Filter collections
        const filteredCards1 = this.filterCollection(this.collection1)
        const filteredCards2 = this.filterCollection(this.collection2)

        let resultingCollection = new Collection(this.rightToLeft ? filteredCards2 : filteredCards1)
        let checkedCollection = new Collection(this.rightToLeft ? filteredCards1 : filteredCards2)

        resultingCollection.cards = resultingCollection.cards.filter(card => {
            return !checkedCollection?.cards.some(card2 => card.id === card2.id)
        })

        this.resultingCollectionUpdated.emit(resultingCollection)
    }

    filterCollection(collection: Collection): UrzaCard[] {
        return collection.cards.filter((card: UrzaCard) => {
            return card.name.toLowerCase().includes(this.nameFilter.toLowerCase())
                && this.filterColor(this.colorFilter, card, true) 
                && this.filterColor(this.colorUnfilter, card, false)
                && this.filterRarity(card)
        })
    }

    filterRarity(card: UrzaCard) {
        if (card.rarity === undefined) {
            return false
        }

        for (const [key, value] of Object.entries(this.rarityFilter)) {
            if (key.toLowerCase() == card.rarity.toLowerCase() && value) {
                return false
            }
        }
        
        return true
    }

    filterColor(filter: ColorFilter, card: UrzaCard, include: boolean): boolean {
        if (card.manaCost === undefined) {
            return false
        }

        const checkColor = (color: string, shouldInclude: boolean) => {
            return shouldInclude ? card.manaCost.includes(color) : !card.manaCost.includes(color);
        };

        if (filter.white && !checkColor("W", include)) return false;
        if (filter.blue && !checkColor("U", include)) return false;
        if (filter.black && !checkColor("B", include)) return false;
        if (filter.red && !checkColor("R", include)) return false;
        if (filter.green && !checkColor("G", include)) return false;
        if (filter.colorless) {
            const colored = ["W", "U", "B", "R", "G"].some(color => card.manaCost.includes(color));
            if ((include && colored) || (!include && !colored)) return false;
        }
        if (filter.multicolor) {
            let count = 0;
            if (card.manaCost.includes("W")) count++;
            if (card.manaCost.includes("U")) count++;
            if (card.manaCost.includes("B")) count++;
            if (card.manaCost.includes("R")) count++;
            if (card.manaCost.includes("G")) count++;
            if ((include && count < 2) || (!include && count >= 2)) return false;
        }

        return true
    }

}