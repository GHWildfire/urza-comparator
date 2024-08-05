import { Component, HostListener, OnInit } from '@angular/core'
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
  cards: UrzaCard[] = []
  index: number = -1
  transferedCard?: UrzaCard
  frontCard?: UrzaCard
  backCard?: UrzaCard

  constructor(private location: Location) {}

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        this.index = Math.max(this.index - 1, 0)
        this.assignCard()
        break;
      case 'ArrowRight':
        this.index = Math.min(this.index + 1, this.cards.length)
        this.assignCard()
        break;
      default:
        break;
    }
  }

  ngOnInit(): void {
    this.cards = history.state.cards
    this.index = history.state.index
    this.assignCard()
  }

  assignCard() {
    if (this.cards.length > 0 && this.index >= 0 && this.index < this.cards.length) {
      this.transferedCard = UrzaCard.fromObject(this.cards[this.index])
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

  onMouseWheel(event: WheelEvent): void {
    if (event.deltaY < 0) {
      this.index = Math.max(this.index - 1, 0)
    } else  {
      this.index = Math.min(this.index + 1, this.cards.length)
    }
    this.assignCard()
  }

  get selectedCard() {
    if (!this.transferedCard?.facingUp) {
      return this.backCard
    }

    return this.frontCard
  }
}
