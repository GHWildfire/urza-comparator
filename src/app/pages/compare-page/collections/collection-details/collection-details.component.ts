import { Component, OnInit, input } from '@angular/core';
import { Collection } from '../../../../data-models/collection.model';
import { CollectionsService } from '../../../../services/collections.service';

@Component({
  selector: 'app-collection-details',
  standalone: true,
  imports: [],
  templateUrl: './collection-details.component.html',
  styleUrl: './collection-details.component.css'
})
export class CollectionDetailsComponent implements OnInit {
  collection? : Collection
  isLeft = input.required<boolean>()

  constructor(private collectionService: CollectionsService) {}

  ngOnInit(): void {
    this.collectionService.getCollection(this.isLeft()).then(collection => {
      this.collection = collection
    })
  }
}
