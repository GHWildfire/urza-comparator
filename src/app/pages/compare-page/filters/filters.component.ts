import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ColorFilterComponent } from "./color-filter/color-filter.component";
import { ComparePageService } from '../compare-page.service';
import { FormsModule } from '@angular/forms';
import { RarityFilterComponent } from "./rarity-filter/rarity-filter.component";

@Component({
    selector: 'app-filters',
    standalone: true,
    templateUrl: './filters.component.html',
    styleUrl: './filters.component.css',
    imports: [ColorFilterComponent, FormsModule, RarityFilterComponent]
})
export class FiltersComponent {
  name: string = ""

  @ViewChildren(ColorFilterComponent) colorFilters!: QueryList<ColorFilterComponent>;
  @ViewChild(RarityFilterComponent) rarityFilter!: RarityFilterComponent

  constructor(private compareService: ComparePageService) {}
  
  resetAllFilters() {
    this.name = ""
    this.compareService.updateName(this.name)
    
    this.colorFilters.forEach((colorFilter) => {
      colorFilter.reset();
    });

    this.rarityFilter.reset()

  }

  update() {
    this.compareService.updateName(this.name)
  }
}
