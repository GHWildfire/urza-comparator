import { Component, input, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ColorFilter } from './color-filter.model'
import { CollectionsService } from '../../../../services/collections.service'
import { ScryfallAPIService } from '../../../../services/scryfall-api.service'
import { Scryfall } from '../../../../data-models/scryfall-models/scryfall.model'

@Component({
  selector: 'app-color-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './color-filter.component.html',
  styleUrl: './color-filter.component.css'
})
export class ColorFilterComponent {
  contains = input.required<boolean>()
  title = input.required<string>()
  colorFilter: ColorFilter = new ColorFilter
  scryfall?: Scryfall
  src: any

  constructor(
    private collectionService: CollectionsService,
    private scryfallService: ScryfallAPIService
  ) {}

  update() {
    this.collectionService.updateColors(this.colorFilter, this.contains())
  }

  reset() {
    this.colorFilter = new ColorFilter
    this.update()
  }

  getColorImg(symbolText: string) {
    const scryfall = this.scryfallService.scryfall
    if (scryfall && scryfall.symbols) {
      const symbol = scryfall.symbols.find((symbol) => symbol.symbol === symbolText)
      return symbol ? symbol.svg_uri : ""
    }

    return ""
  }
}
