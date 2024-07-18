import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core'
import { ColorFilterComponent } from "./color-filter/color-filter.component"
import { FormsModule } from '@angular/forms'
import { RarityFilterComponent } from "./rarity-filter/rarity-filter.component"
import { CollectionsService } from '../../../services/collections.service'
import { MatDialogModule } from '@angular/material/dialog'
import { ScryfallAPIService } from '../../../services/scryfall-api.service'
import { Scryfall } from '../../../data-models/scryfall-models/scryfall.model'
import { ScryfallSet } from '../../../data-models/scryfall-models/scryfall-set.model'
import { TagComponent } from './tag-input/tag/tag.component'
import { TagInputComponent } from "./tag-input/tag-input.component";
import { Filters } from '../../../data-models/filter-models/filters.model'

@Component({
    selector: 'app-filters',
    standalone: true,
    templateUrl: './filters.component.html',
    styleUrl: './filters.component.scss',
    imports: [ColorFilterComponent, FormsModule, RarityFilterComponent, MatDialogModule, TagComponent, TagInputComponent]
})
export class FiltersComponent implements OnInit {
  name: string = ""
  scryfall?: Scryfall
  filters: Filters = new Filters

  @ViewChildren(ColorFilterComponent) colorFilters!: QueryList<ColorFilterComponent>
  @ViewChild(RarityFilterComponent) rarityFilter!: RarityFilterComponent
  @ViewChild(TagInputComponent) tagInputs!: TagInputComponent

  constructor(
    public collectionService: CollectionsService,
    public scryfallService: ScryfallAPIService
  ) {}

  ngOnInit(): void {
    this.scryfall = this.scryfallService.scryfall
    this.scryfallService.scryfallLoaded.subscribe((scryfall) => {
      this.scryfall = scryfall
    })

    this.filters = this.collectionService.filters
  }

  get sets() {
    if (!this.scryfall) {
      return []
    }

    return this.scryfall.sets.sort((setA, setB) => setA.name?.localeCompare(setB.name!) ?? 0)
  }

  updateSets(sets: ScryfallSet[]) {
    this.filters.sets = sets
    this.updateFilters()
  }

  updateFilters() {
    this.collectionService.updateFilters(this.filters)
  }
  
  resetAllFilters() {
    this.name = ""
    this.collectionService.updateName(this.name)
    
    this.colorFilters.forEach((colorFilter) => {
      colorFilter.reset()
    })

    this.rarityFilter.reset()
    this.tagInputs.reset()
  }
}
