import { Component, OnInit } from '@angular/core'
import { CollectionDetailsComponent } from './collection-details/collection-details.component'
import { CollectionsService } from '../../../services/collections.service'
import { NavigationEnd, Router } from '@angular/router'

@Component({
    selector: 'app-collections',
    standalone: true,
    templateUrl: './collections.component.html',
    styleUrl: './collections.component.scss',
    imports: [CollectionDetailsComponent]
})
export class CollectionsComponent implements OnInit {
  rightToLeft: boolean = true
  isComparePage: boolean = false

  constructor(
    private router: Router,
    private collectionsService: CollectionsService
  ) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.isComparePage = val.url === '/compare'
      }
    })
  }

  ngOnInit(): void {
    this.isComparePage = this.router.url === '/compare'
  }
  
  swap() {
    this.rightToLeft = !this.rightToLeft
    this.collectionsService.swap()
  }
}
