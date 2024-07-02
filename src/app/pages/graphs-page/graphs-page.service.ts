import { Injectable } from "@angular/core"
import { UrzaCard } from "../../data-models/urza-card.model"
import { Collection } from "../../data-models/collection.model"

@Injectable({ providedIn: 'root' })
export class GraphsPageService {

    constructGraphData(collection1: Collection, collection2: Collection) {
        if (!collection1 || !collection2) {
          return
        }
    
        // Get dates
        const dates1 = this.yearsFromCollection(collection1.cards)
        const dates2 = this.yearsFromCollection(collection2.cards)
    
        // Get min - max
        const allYears = [...Object.keys(dates1), ...Object.keys(dates2)].map(yearStr => parseInt(yearStr))
        const min = Math.min(...allYears)
        const max = Math.max(...allYears)
        
        let graphLabels: string[] = []
        let graphData1: number[] = []
        let graphData2: number[] = []
        
        for (let i = min; i <= max; i++) {
          graphLabels.push(i.toString())
          graphData1.push(dates1[i] ?? 0)
          graphData2.push(dates2[i] ?? 0)
        }

        return {
            graphLabels: graphLabels,
            graphData1: graphData1,
            graphData2: graphData2
        }
    }

    yearsFromCollection(cards: UrzaCard[]) {
      return cards
        .map((card) => card.scryfallData?.released_at)  // Card -> Release date
        .filter((date) => date !== undefined)           // Filter out undefined dates
        .map((date) => parseInt(date!.split('-')[0]))   // Defined release date -> year as number
        .reduce((acc, year) => {                        // Regroup by year
            acc[year] = (acc[year] || 0) + 1
            return acc
        }, {} as { [year: number]: number })
    }
}