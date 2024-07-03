import { Component, OnInit } from '@angular/core'
import { UrzaCard } from '../../data-models/urza-card.model'
import { Location } from '@angular/common'
import { CardRowComponent } from "./card-row/card-row.component"

@Component({
    selector: 'app-card-details',
    standalone: true,
    templateUrl: './card-details.component.html',
    styleUrl: './card-details.component.scss',
    imports: [CardRowComponent]
})
export class CardDetailsComponent implements OnInit {
  transferedCard?: UrzaCard
  frontCard?: UrzaCard
  backCard?: UrzaCard

  constructor(private location: Location) {}

  ngOnInit(): void {
    this.transferedCard = UrzaCard.fromObject(history.state.card)
    if (this.transferedCard) {
      this.frontCard = UrzaCard.fromObject(this.transferedCard)
      this.backCard = UrzaCard.fromObject(this.transferedCard.backCard)
    }
  }

  return() {
    this.location.back()
  }

  swap() {
    if (this.transferedCard) {
      this.transferedCard.facingUp = !this.transferedCard.facingUp
    }
  }

  get selectedCard() {
    if (!this.transferedCard?.facingUp) {
      return this.backCard
    }

    return this.frontCard
  }
}
