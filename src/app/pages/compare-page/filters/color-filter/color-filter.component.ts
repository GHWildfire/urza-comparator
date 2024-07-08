import { Component, input, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ColorFilter } from './color-filter.model'
import { CollectionsService } from '../../../../services/collections.service'
import { ScryfallAPIService } from '../../../../services/scryfall-api.service'
import { Scryfall } from '../../../../data-models/scryfall-models/scryfall.model'
import { CommonModule } from "@angular/common"

@Component({
  selector: 'app-color-filter',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './color-filter.component.html',
  styleUrl: './color-filter.component.scss'
})
export class ColorFilterComponent implements OnInit {
  identifier = input.required<string>()
  title = input.required<string>()
  colorFilter: ColorFilter = new ColorFilter
  scryfall?: Scryfall
  src: any

  constructor(
    private collectionService: CollectionsService,
    private scryfallService: ScryfallAPIService
  ) {}

  ngOnInit(): void {
    if (this.identifier() === "color-include") {
      this.colorFilter = this.collectionService.colorFilter
    } else if (this.identifier() === "color-exclude") {
      this.colorFilter = this.collectionService.colorUnfilter
    }
  }

  updateColor(color: keyof ColorFilter) {
    this.colorFilter[color] = !this.colorFilter[color]
    this.update()
  }

  reset() {
    this.colorFilter = new ColorFilter
    this.update()
  }

  update() {
    this.collectionService.updateColors(this.colorFilter, this.identifier())
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
