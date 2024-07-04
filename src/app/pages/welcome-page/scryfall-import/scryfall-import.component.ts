import { Component } from '@angular/core'
import { ScryfallAPIService } from '../../../services/scryfall-api.service'
import { ScryfallCollection } from '../../../data-models/scryfall-models/scryfall-collection.model'
import { CommonModule  } from '@angular/common'

@Component({
  selector: 'app-scryfall-import',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scryfall-import.component.html',
  styleUrl: './scryfall-import.component.css'
})
export class ScryfallImportComponent {
  scryfallCollection?: ScryfallCollection

  constructor(private collectionService: ScryfallAPIService) {
    collectionService.scryfallLoaded.subscribe(collection => {
      this.scryfallCollection = collection
    })
  }
}
