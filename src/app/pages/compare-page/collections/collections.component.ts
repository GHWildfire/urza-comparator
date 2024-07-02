import { Component } from '@angular/core';
import { CollectionDetailsComponent } from './collection-details/collection-details.component';
import { CollectionsService } from '../../../services/collections.service';

@Component({
    selector: 'app-collections',
    standalone: true,
    templateUrl: './collections.component.html',
    styleUrl: './collections.component.scss',
    imports: [CollectionDetailsComponent]
})
export class CollectionsComponent {
  rightToLeft: boolean = true

  constructor(private collectionService: CollectionsService) {}
  
  swap() {
    this.rightToLeft = !this.rightToLeft
    this.collectionService.swap()
  }
}
