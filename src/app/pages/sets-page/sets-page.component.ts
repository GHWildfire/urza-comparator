import { Component, OnInit, ViewChild } from '@angular/core'
import { SetsPageService } from './sets-page.service'
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling'
import { SetsPageRowComponent } from './sets-page-row/sets-page-row.component'
import { ScryfallSet } from '../../data-models/scryfall-models/scryfall-set.model'
import { ScryfallAPIService } from '../../services/scryfall-api.service'

@Component({
  selector: 'app-sets-page',
  standalone: true,
  imports: [ScrollingModule, SetsPageRowComponent],
  templateUrl: './sets-page.component.html',
  styleUrl: './sets-page.component.scss'
})
export class SetsPageComponent implements OnInit {
  sets: ScryfallSet[] = []

  @ViewChild('cdkViewport') cdkViewport: CdkVirtualScrollViewport | undefined

  constructor(
    private setsPageService: SetsPageService,
    private scryfallService: ScryfallAPIService
  ) {
    this.sets = this.setsPageService.getSets()
  }

  ngOnInit(): void {
    this.scryfallService.scryfallLinked.subscribe((_) => {
      this.sets = this.setsPageService.getSets()
    })
  }

}
