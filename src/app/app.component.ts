import { Component, signal } from '@angular/core'
import { Router, RouterOutlet } from '@angular/router'
import { CollectionImportComponent } from './pages/welcome-page/collection-import/collection-import.component'
import { Collection } from './data-models/collection.model'
import { WelcomePageComponent } from "./pages/welcome-page/welcome-page.component"
import { NavbarComponent } from "./navbar/navbar.component"
import { CollectionsComponent } from './pages/compare-page/collections/collections.component'

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
export class AppComponent {
    currentRoute = signal<string>("")
    collection: Collection = new Collection([], false)

    constructor(private router: Router) {
        this.router.events.subscribe(() => {
            this.currentRoute.set(this.router.url)
        })
    }


}
