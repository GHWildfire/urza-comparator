import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CollectionImportComponent } from './pages/welcome-page/collection-import/collection-import.component';
import { ScryfallAPIService } from './services/scryfall-api.service';
import { Collection } from './data-models/collection.model';
import { ScryfallImportComponent } from './pages/welcome-page/scryfall-import/scryfall-import.component';
import { WelcomePageComponent } from "./pages/welcome-page/welcome-page.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { CollectionsComponent } from './pages/compare-page/collections/collections.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [
        RouterOutlet,
        CollectionImportComponent,
        ScryfallImportComponent,
        WelcomePageComponent,
        NavbarComponent,
        CollectionsComponent
    ]
})
export class AppComponent implements OnInit {
    currentRoute = signal<string>("")
    collection: Collection = new Collection([])

    constructor(private collectionService: ScryfallAPIService, private router: Router) {
        /*collectionService.collectionLoaded.subscribe((collection: Collection) => {
            this.collection = collection
        })*/
        this.router.events.subscribe(() => {
            this.currentRoute.set(this.router.url);
        })
    }

    ngOnInit(): void {
        //this.collectionService.loadScryfallCollection()
    }


}
