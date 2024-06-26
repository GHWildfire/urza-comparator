import { Component, OnInit } from '@angular/core';
import { CollectionImportComponent } from './collection-import/collection-import.component';
import { ScryfallAPIService } from '../../services/scryfall-api.service';
import { Router } from '@angular/router';
import { CollectionsService } from '../../services/collections.service';

@Component({
    selector: 'app-welcome-page',
    standalone: true,
    templateUrl: './welcome-page.component.html',
    styleUrl: './welcome-page.component.css',
    imports: [CollectionImportComponent]
})
export class WelcomePageComponent implements OnInit {
    disableCompare: boolean = true

    constructor(
        private collectionsService: CollectionsService, 
        private router: Router
    ) {}

    ngOnInit(): void {
        this.collectionsService.collectionsReady.subscribe(state => {
            this.disableCompare = !state
        })

        this.disableCompare = !this.collectionsService.areCollectionsImported()
    }

    startComparing() {
        this.collectionsService.lockCollections()
        this.router.navigate(["/compare"])
    }

}
