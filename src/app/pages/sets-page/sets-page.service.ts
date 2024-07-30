import { Injectable } from "@angular/core"
import { ScryfallSet } from "../../data-models/scryfall-models/scryfall-set.model"
import { ScryfallAPIService } from "../../services/scryfall-api.service"

@Injectable({ providedIn: 'root' })
export class SetsPageService {

    constructor(private scryfallService: ScryfallAPIService) {}

    getSets(): ScryfallSet[] {
        // Stop if scryfall not loaded yet
        let scryfall = this.scryfallService.scryfall
        if (!scryfall) {
            return []
        }

        // Initialize parent layer for all sets
        const setsMap = new Map<string, ScryfallSet>()
        scryfall.sets.forEach(set => setsMap.set(set.code ?? '', set))
    
        // Recusrive function to compute parent layer
        const computeParentLayer = (set: ScryfallSet, depth: number = 0): number => {
            if (!set.parent_set_code) return depth
            const parentSet = setsMap.get(set.parent_set_code)
            set.parent_set = parentSet
            if (!parentSet) return depth
            
            return computeParentLayer(parentSet, depth + 1)
        }
    
        // Compute parent layer for each set
        scryfall.sets.forEach(set => {
            set.parentLayer = computeParentLayer(set)
        })
    
        // Create a map of parent sets
        let sets = this.orderSets(this.filterSets(scryfall.sets))
        const parentMap = new Map<string, ScryfallSet[]>()
        sets.forEach(set => {
            if (set.parent_set_code) {
                const parentCode = set.parent_set_code ?? ''
                if (!parentMap.has(parentCode)) {
                    parentMap.set(parentCode, [])
                }
                parentMap.get(parentCode)?.push(set)
            }
        })
    
        // Create the final sorted and nested list
        const finalResult: ScryfallSet[] = []
        sets.forEach(set => {
            if (!set.parent_set_code) {
                finalResult.push(set)
                appendChildren(set, 1)
            }
        })
    
        function appendChildren(set: ScryfallSet, depth: number) {
            const setCode = set.code ?? ''
            if (parentMap.has(setCode)) {
                const children = parentMap.get(setCode)!
                children.forEach(child => {
                    finalResult.push(child)
                    appendChildren(child, depth + 1)
                })
            }
        }
    
        return finalResult
    }

    private filterSets(sets: ScryfallSet[]): ScryfallSet[] {
        return sets.filter((set) => {
            return set.leftCollectionSubset.length > 0 || set.rightCollectionSubset.length > 0
        })
    }

    private orderSets(sets: ScryfallSet[]): ScryfallSet[] {
        return sets.sort((setA, setB) => {
            const dateA = setA.released_at ?? ''
            const dateB = setB.released_at ?? ''
            return dateA.localeCompare(dateB)
        }).reverse()
    }
}