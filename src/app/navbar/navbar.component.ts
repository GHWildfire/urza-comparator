import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CollectionsService } from '../services/collections.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
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

  compare() {
    this.router.navigate(["/compare"])
  }

  graphs() {
    this.router.navigate(["/graphs"])
  }

  get displayLinks() {
    return this.collectionsService.areCollectionsImported()
  }
}
