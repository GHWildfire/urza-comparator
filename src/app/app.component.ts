import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CollectionImportComponent } from './pages/welcome-page/collection-import/collection-import.component';
import { CollectionComponent } from "./collection/collection.component";
import { WelcomePageService } from './pages/welcome-page/welcome-page.service';
import { Collection } from './collection/collection.model';
import { ScryfallImportComponent } from './pages/welcome-page/scryfall-import/scryfall-import.component';
import { WelcomePageComponent } from "./pages/welcome-page/welcome-page.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { CollectionsComponent } from "./collections/collections.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [
        RouterOutlet,
        CollectionImportComponent,
        CollectionComponent,
        ScryfallImportComponent,
        WelcomePageComponent,
        NavbarComponent,
        CollectionsComponent
    ]
})
export class AppComponent implements OnInit {
    currentRoute = signal<string>("")
    collection: Collection = new Collection([])

    constructor(private collectionService: WelcomePageService, private router: Router) {
        collectionService.collectionLoaded.subscribe((collection: Collection) => {
            this.collection = collection
        })
        this.router.events.subscribe(() => {
            this.currentRoute.set(this.router.url);
        })
    }

    ngOnInit(): void {
        this.collectionService.loadScryfallCollection()
    }


}
