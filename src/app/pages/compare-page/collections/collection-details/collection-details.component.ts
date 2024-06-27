import { Component, OnInit, input } from '@angular/core';
import { Collection } from '../../../../data-models/collection.model';
import { CollectionsService } from '../../../../services/collections.service';
import { ScryfallAPIService } from '../../../../services/scryfall-api.service';

@Component({
  selector: 'app-collection-details',
  standalone: true,
  imports: [],
  templateUrl: './collection-details.component.html',
  styleUrl: './collection-details.component.css'
})
export class CollectionDetailsComponent implements OnInit {
  collection?: Collection
  isLeft = input.required<boolean>()
  linkingProgress: number = 0

  constructor(
    private collectionService: CollectionsService,
    private scryfallAPIService: ScryfallAPIService
  ) {}

  ngOnInit(): void {
    this.collectionService.getCollection(this.isLeft()).then(collection => {
      this.collection = collection

      if (this.collection?.cardsLinked) {
        this.linkingProgress = this.collection.cards.length
      }
    })

    this.scryfallAPIService.collectionLinking.subscribe(state => {
      if (state.isLeft === this.isLeft()) {
        this.linkingProgress = state.progress
      }
    })
  }

  get progressDisplay() {
    return this.linkingProgress + " / " + this.collection?.cards.length
  }
}
