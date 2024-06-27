import { Component, OnInit } from '@angular/core';
import { UrzaCard } from '../../data-models/urza-card.model';

@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [],
  templateUrl: './card-details.component.html',
  styleUrl: './card-details.component.css'
})
export class CardDetailsComponent implements OnInit {
  card?: UrzaCard;

  ngOnInit(): void {
    this.card = history.state.card
  }
}
