import { Component, OnInit, input } from '@angular/core';
import { UrzaCard } from '../../../data-models/urza-card.model';
import { Router } from '@angular/router';
import { CollectionsService } from '../../../services/collections.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card-preview.component.html',
  styleUrl: './card-preview.component.scss'
})
export class CardPreviewComponent {
  card = input.required<UrzaCard>()
  index = input.required<number>()
  mouseIn: boolean = false
  rotationFactor: number = 15

  constructor(
    private router: Router,
    private collectionsService: CollectionsService
  ) {}

  open() {
    this.collectionsService.selectedCardIndex = this.index()
    this.router.navigate(["/cards/" + this.card().id], { 
      state: { 
        card: this.card() 
      } 
    })
  }

  get quantityTag() {
    return this.card().count
  }

  get priceTag() {
    let result = "No price found"

    const prices = this.card().scryfallData?.prices
    if (!prices) {
      return result
    }

    const euro = prices.eur
    const eurofoil = prices.eur_foil

    if (euro === null && eurofoil === null) {
      return result
    }

    result = ""
    if (euro !== null) result = "€" + euro
    if (euro !== null && eurofoil !== null) result += " / "
    if (eurofoil !== null) result += "€" + eurofoil

    return result
  }
}
