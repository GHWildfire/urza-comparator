import { Component, OnInit, output } from '@angular/core'
import { RarityFilter } from '../../../../data-models/filter-models/rarity-filter.model'
import { FormsModule } from '@angular/forms'
import { CollectionsService } from '../../../../services/collections.service'

@Component({
  selector: 'app-rarity-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './rarity-filter.component.html',
  styleUrl: './rarity-filter.component.scss'
})
export class RarityFilterComponent implements OnInit {
  rarityFilter: RarityFilter = new RarityFilter
  raritiesChanged = output<RarityFilter>()

  constructor(private collectionService: CollectionsService) {}

  ngOnInit(): void {
    this.rarityFilter = this.collectionService.filters.rarityFilter
  }

  reset() {
    this.rarityFilter = new RarityFilter
    this.updateRarity()
  }

  changeRarity(rarity: keyof RarityFilter) {
    this.rarityFilter[rarity] = !this.rarityFilter[rarity]
    this.updateRarity()
  }

  updateRarity() {
    this.raritiesChanged.emit(this.rarityFilter)
  }
}
