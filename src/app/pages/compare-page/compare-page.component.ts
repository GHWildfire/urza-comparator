import { Component, OnInit } from '@angular/core';
import { CollectionComponent } from "../../collection/collection.component";
import { Collection } from '../../collection/collection.model';
import { FiltersComponent } from "./filters/filters.component";
import { ComparePageService } from './compare-page.service';

@Component({
    selector: 'app-compare-page',
    standalone: true,
    templateUrl: './compare-page.component.html',
    styleUrl: './compare-page.component.css',
    imports: [CollectionComponent, FiltersComponent]
})
export class ComparePageComponent implements OnInit {
  collection: Collection = new Collection([])

  constructor(private compareService: ComparePageService) {}
  
  ngOnInit(): void {
    this.compareService.resultingCollectionUpdated.subscribe(updatedCollection => {
      this.collection = updatedCollection
    })

    this.compareService.update()
  }
}
