import { Component, OnInit, signal } from '@angular/core'
import { Router, RouterOutlet } from '@angular/router'
import { CollectionImportComponent } from './pages/welcome-page/collection-import/collection-import.component'
import { Collection } from './data-models/collection.model'
import { WelcomePageComponent } from "./pages/welcome-page/welcome-page.component"
import { NavbarComponent } from "./navbar/navbar.component"
import { CollectionsComponent } from './pages/compare-page/collections/collections.component'
import { ScryfallAPIService } from './services/scryfall-api.service'

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [
        RouterOutlet,
        CollectionImportComponent,
        WelcomePageComponent,
        NavbarComponent,
        CollectionsComponent
    ]
})
export class AppComponent implements OnInit {
    currentRoute = signal<string>("")
    collection: Collection = new Collection([], false)
    displayScryfallLoader: boolean = true

    constructor(
        private router: Router,
        public scryfallService: ScryfallAPIService
    ) {}

    ngOnInit(): void {
        this.router.events.subscribe(() => {
            this.currentRoute.set(this.router.url)
        })

        this.scryfallService.scryfallLoaded.subscribe((_) => {
            this.displayScryfallLoader = false
        })
    }
}
