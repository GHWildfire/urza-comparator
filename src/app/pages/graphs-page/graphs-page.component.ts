import { AfterViewInit, Component, ViewChild } from '@angular/core'
import { Chart } from 'chart.js/auto' 
import { CollectionsService } from '../../services/collections.service'
import { Collection } from '../../data-models/collection.model'
import { GraphsPageService } from './graphs-page.service'

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

  @ViewChild('chart')
  chart: any

  constructor(
    private collectionsService: CollectionsService,
    private graphsPageService: GraphsPageService
  ) {}

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

  constructChart() {
    if (!this.collection1 || !this.collection2) {
      return
    }

    const graphData = this.graphsPageService.constructGraphData(this.collection1, this.collection2)

    if (!graphData) {
      return
    }

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
              data: graphData.graphData1,
              backgroundColor: backgroundColor,
              borderColor: primaryColor,
              fill: true
            },
            {
              label: this.collection2.file?.name,
              data: graphData.graphData2,
              backgroundColor: backgroundColor,
              borderColor: secondaryColor,
              fill: true
            }
          ],
          labels: graphData.graphLabels
        }
      }
    )
  }
}
