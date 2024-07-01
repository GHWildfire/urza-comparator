import { Component, OnInit } from '@angular/core';
import { UrzaCard } from '../../data-models/urza-card.model';
import { Location } from '@angular/common';
import { CardRowComponent } from "./card-row/card-row.component";
import { CardsService } from '../../services/cards.service';

@Component({
    selector: 'app-card-details',
    standalone: true,
    templateUrl: './card-details.component.html',
    styleUrl: './card-details.component.css',
    imports: [CardRowComponent]
})
export class CardDetailsComponent implements OnInit {
  card?: UrzaCard;

  constructor(
    private location: Location,
    public cardDetailsService: CardsService
  ) {}

  ngOnInit(): void {
    this.card = history.state.card
  }

  return() {
    this.location.back()
  }
}
