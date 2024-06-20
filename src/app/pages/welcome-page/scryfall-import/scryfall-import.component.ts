import { Component, OnInit } from '@angular/core';
import { WelcomePageService } from '../welcome-page.service';
import { ScryfallCollection } from '../../../data-models/scryfall-collection.model';
import { CommonModule  } from '@angular/common';

@Component({
  selector: 'app-scryfall-import',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scryfall-import.component.html',
  styleUrl: './scryfall-import.component.css'
})
export class ScryfallImportComponent implements OnInit {
  scryfallCollection?: ScryfallCollection

  constructor(private collectionService: WelcomePageService) {
    collectionService.scryfallLoaded.subscribe(collection => {
      this.scryfallCollection = collection
    })
  }

  ngOnInit(): void {
    this.scryfallCollection = this.collectionService.loadScryfallCollection()
  }
}
