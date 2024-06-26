import { Component } from '@angular/core';
import { RarityFilter } from './rarity-filter.model';
import { FormsModule } from '@angular/forms';
import { CollectionsService } from '../../../../services/collections.service';

@Component({
  selector: 'app-rarity-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './rarity-filter.component.html',
  styleUrl: './rarity-filter.component.css'
})
export class RarityFilterComponent {
  rarityFilter: RarityFilter = new RarityFilter

  constructor(private collectionService: CollectionsService) {}

  update() {
    this.collectionService.updateRarities(this.rarityFilter)
  }

  reset() {
    this.rarityFilter = new RarityFilter
    this.update()
  }
}
