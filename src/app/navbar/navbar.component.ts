import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { CollectionsService } from '../services/collections.service'
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor(
    private router: Router,
    private collectionsService: CollectionsService
  ) {}

  home() {
    this.router.navigate(["/"])
  }

  get displayLinks() {
    return this.collectionsService.areCollectionsImported()
  }
}
