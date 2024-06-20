import { Component, OnInit } from '@angular/core';
import { CollectionImportComponent } from './collection-import/collection-import.component';
import { WelcomePageService } from './welcome-page.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-welcome-page',
    standalone: true,
    templateUrl: './welcome-page.component.html',
    styleUrl: './welcome-page.component.css',
    imports: [CollectionImportComponent]
})
export class WelcomePageComponent implements OnInit {
    disableCompare: boolean = true

    constructor(private cardsService: WelcomePageService, private router: Router) {}

    ngOnInit(): void {
        this.cardsService.collectionsReady.subscribe(state => {
          this.disableCompare = !state
        })

        this.disableCompare = !this.cardsService.areCollectionsImported()
    }

    startComparing() {
        this.cardsService.transferCollections()
        this.router.navigate(["/compare"])
    }

}
