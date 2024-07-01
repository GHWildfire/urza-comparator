import { AfterViewInit, Component, ViewChild } from '@angular/core'
import { Chart } from 'chart.js/auto' 
import { CollectionsService } from '../../services/collections.service'
import { Collection } from '../../data-models/collection.model'
import { UrzaCard } from '../../data-models/urza-card.model'

@Component({
  selector: 'app-graphs-page',
  standalone: true,
  imports: [],
  templateUrl: './graphs-page.component.html',
  styleUrl: './graphs-page.component.css'
})
export class GraphsPageComponent implements AfterViewInit{
  canvas: any
  ctx: any

  collection1?: Collection
  collection2?: Collection

  graphLabels?: string[]
  graphData1?: number[]
  graphData2?: number[]

  @ViewChild('chart')
  chart: any

  constructor(private collectionsService: CollectionsService) {}

  ngAfterViewInit(): void {
    this.collectionsService.getCollection(true).then(collection => {
      this.collection1 = collection
      this.constructChart()
    })

    this.collectionsService.getCollection(false).then(collection => {
      this.collection2 = collection
      this.constructChart()
    })
  }

  yearsFromCollection(cards: UrzaCard[]) {
    return cards
      .map((card) => card.scryfallData?.released_at)  // Card -> Release date
      .filter((date) => date !== undefined)           // Filter out undefined dates
      .map((date) => parseInt(date!.split('-')[0]))   // Defined release date -> year as number
      .reduce((acc, year) => {                        // Regroup by year
        acc[year] = (acc[year] || 0) + 1;
        return acc;
      }, {} as { [year: number]: number })
  }
  
  constructGraphData() {
    if (!this.collection1 || !this.collection2) {
      return
    }

    // Get dates
    const dates1 = this.yearsFromCollection(this.collection1.cards)
    const dates2 = this.yearsFromCollection(this.collection2.cards)

    // Get min - max
    const allYears = [...Object.keys(dates1), ...Object.keys(dates2)].map(yearStr => parseInt(yearStr));
    const min = Math.min(...allYears)
    const max = Math.max(...allYears)
    
    this.graphLabels = []
    this.graphData1 = []
    this.graphData2 = []
    
    for (let i = min; i <= max; i++) {
      this.graphLabels.push(i.toString())
      this.graphData1?.push(dates1[i] ?? 0)
      this.graphData2?.push(dates2[i] ?? 0)
    }
  }

  constructChart() {
    if (!this.collection1 || !this.collection2) {
      return
    }

    this.constructGraphData()

    this.canvas = this.chart.nativeElement
    this.ctx = this.canvas.getContext('2d')

    const rootStyles = getComputedStyle(document.documentElement)
    const primaryColor = rootStyles.getPropertyValue('--primary').trim()
    const secondaryColor = rootStyles.getPropertyValue('--secondary').trim()
    const backgroundColor = "rgb(0 0 0 / 20%)"

    let labels = []
    for (let i = 0; i < 30; i++) {
      labels.push("Label " + (i + 1))
    }

    new Chart(
      this.ctx,
      {
        type: 'line',
        data: {
          datasets: [
            {
              label: this.collection1.file?.name,
              data: this.graphData1,
              backgroundColor: backgroundColor,
              borderColor: primaryColor,
              fill: true
            },
            {
              label: this.collection2.file?.name,
              data: this.graphData2,
              backgroundColor: backgroundColor,
              borderColor: secondaryColor,
              fill: true
            }
          ],
          labels: this.graphLabels
        }
      }
    )
  }
}
