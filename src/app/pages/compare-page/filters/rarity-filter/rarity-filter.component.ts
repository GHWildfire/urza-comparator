import { Component, OnInit } from '@angular/core'
import { RarityFilter } from './rarity-filter.model'
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

  constructor(private collectionService: CollectionsService) {}

  ngOnInit(): void {
    this.rarityFilter = this.collectionService.rarityFilter
  }

  update() {
    this.collectionService.updateRarities(this.rarityFilter)
  }

  reset() {
    this.rarityFilter = new RarityFilter
    this.update()
  }

  updateRarity(rarity: keyof RarityFilter) {
    this.rarityFilter[rarity] = !this.rarityFilter[rarity]
    this.update()
  }
}
