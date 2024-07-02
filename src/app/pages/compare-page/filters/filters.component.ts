import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core'
import { ColorFilterComponent } from "./color-filter/color-filter.component"
import { FormsModule } from '@angular/forms'
import { RarityFilterComponent } from "./rarity-filter/rarity-filter.component"
import { CollectionsService } from '../../../services/collections.service'

@Component({
    selector: 'app-filters',
    standalone: true,
    templateUrl: './filters.component.html',
    styleUrl: './filters.component.css',
    imports: [ColorFilterComponent, FormsModule, RarityFilterComponent]
})
export class FiltersComponent {
  name: string = ""

  @ViewChildren(ColorFilterComponent) colorFilters!: QueryList<ColorFilterComponent>
  @ViewChild(RarityFilterComponent) rarityFilter!: RarityFilterComponent

  constructor(private collectionService: CollectionsService) {}
  
  resetAllFilters() {
    this.name = ""
    this.collectionService.updateName(this.name)
    
    this.colorFilters.forEach((colorFilter) => {
      colorFilter.reset()
    })

    this.rarityFilter.reset()

  }
}
