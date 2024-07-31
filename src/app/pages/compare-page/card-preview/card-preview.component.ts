import { Component, input, OnInit } from '@angular/core'
import { UrzaCard } from '../../../data-models/urza-card.model'
import { Router } from '@angular/router'
import { CollectionsService } from '../../../services/collections.service'

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card-preview.component.html',
  styleUrl: './card-preview.component.scss'
})
export class CardPreviewComponent {
  cards = input.required<UrzaCard[]>()
  card = input.required<UrzaCard>()
  rowIndex = input.required<number>()
  arrayIndex = input.required<number>()

  mouseIn: boolean = false
  rotationFactor: number = 15

  constructor(
    private router: Router,
    private collectionsService: CollectionsService
  ) {}

  open() {
    this.collectionsService.selectedCardIndex = this.rowIndex()
    this.router.navigate(["/cards/" + this.card().id], { 
      state: { 
        cards: this.cards(),
        index: this.arrayIndex()
      } 
    })
  }

  swap(event: Event) {
    event.stopPropagation()
    this.card().facingUp = !this.card().facingUp
  }
}
