import { Component, OnInit, input } from '@angular/core';
import { Collection } from '../../collection/collection.model';
import { ComparePageService } from '../../pages/compare-page/compare-page.service';

@Component({
  selector: 'app-collection-details',
  standalone: true,
  imports: [],
  templateUrl: './collection-details.component.html',
  styleUrl: './collection-details.component.css'
})
export class CollectionDetailsComponent implements OnInit {
  collection? : Collection
  id = input.required<string>()

  constructor(private compareService: ComparePageService) {}

  ngOnInit(): void {
    this.compareService.getCollection(this.id()).then(collection => {
      this.collection = collection
    })
  }
}
