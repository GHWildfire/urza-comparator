import { Routes } from '@angular/router';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { ComparePageComponent } from './pages/compare-page/compare-page.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { CardDetailsComponent } from './pages/card-details/card-details.component';

export const routes: Routes = [
    { path: '', component: WelcomePageComponent },
    { path: 'compare', component: ComparePageComponent },
    { path: 'cards', component: CardDetailsComponent, children: [
        { path: ':id', component: CardDetailsComponent },
    ] },
    { path: 'not-found', component: ErrorPageComponent, data: { message: 'Page not found!' } },
    { path: '**', redirectTo: '/not-found' }
]
