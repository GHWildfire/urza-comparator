import { Component, input } from '@angular/core'
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

  swap(event: Event) {
    event.stopPropagation()
    this.card().facingUp = !this.card().facingUp
  }
}
