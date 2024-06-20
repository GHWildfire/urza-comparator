import { Component } from '@angular/core';
import { CollectionDetailsComponent } from './collection-details/collection-details.component';
import { ComparePageService } from '../pages/compare-page/compare-page.service';

@Component({
    selector: 'app-collections',
    standalone: true,
    templateUrl: './collections.component.html',
    styleUrl: './collections.component.css',
    imports: [CollectionDetailsComponent]
})
export class CollectionsComponent {
  rightToLeft: boolean = true

  constructor(private compareService: ComparePageService) {}
  
  swap() {
    this.rightToLeft = !this.rightToLeft
    this.compareService.swap()
  }
}
