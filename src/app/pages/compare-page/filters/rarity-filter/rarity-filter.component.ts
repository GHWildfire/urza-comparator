import { Component } from '@angular/core';
import { RarityFilter } from './rarity-filter.model';
import { ComparePageService } from '../../compare-page.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rarity-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './rarity-filter.component.html',
  styleUrl: './rarity-filter.component.css'
})
export class RarityFilterComponent {
  rarityFilter: RarityFilter = new RarityFilter

  constructor(private compareService: ComparePageService) {}

  update() {
    this.compareService.updateRarities(this.rarityFilter)
  }

  reset() {
    this.rarityFilter = new RarityFilter
    this.update()
  }
}
