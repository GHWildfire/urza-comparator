import { Component, input } from '@angular/core';
import { UrzaCard } from '../../data-models/urza-card.model';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  card = input.required<UrzaCard>()
  mouseIn: boolean = false
  rotationFactor: number = 15

  get quantityTag() {
    return this.card().count
  }

  get priceTag() {
    let result = "No price found"

    const prices = this.card().prices
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
