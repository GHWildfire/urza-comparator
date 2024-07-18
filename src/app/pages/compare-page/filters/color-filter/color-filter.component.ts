import { Component, input, OnInit, output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ColorFilter } from '../../../../data-models/filter-models/color-filter.model'
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
  initialColorFilter = input.required<ColorFilter>()
  initialOppositeColorFilter = input.required<ColorFilter>()
  colorsChanged = output<ColorFilter>()

  colorFilter: ColorFilter = new ColorFilter
  oppositeFilter: ColorFilter = new ColorFilter
  scryfall?: Scryfall
  src: any

  constructor(
    private collectionService: CollectionsService,
    private scryfallService: ScryfallAPIService
  ) {}

  ngOnInit(): void {
    this.collectionService.colorFilterUpdated.subscribe((event) => {
      if (event.filterId !== this.identifier()) {
        this.oppositeFilter = event.filter
      }
    })

    this.colorFilter = this.initialColorFilter()
    this.oppositeFilter = this.initialOppositeColorFilter()
  }

  get colorlessCheck(): boolean {
    return !this.oppositeFilter.colorless
      && !this.colorFilter.white
      && !this.colorFilter.blue
      && !this.colorFilter.black
      && !this.colorFilter.red
      && !this.colorFilter.green
  }

  changeColor(color: keyof ColorFilter) {
    this.colorFilter[color] = !this.colorFilter[color]
    this.updateColor()
  }

  reset() {
    this.colorFilter = new ColorFilter
    this.oppositeFilter = new ColorFilter
    this.updateColor()
  }

  updateColor() {
    this.colorsChanged.emit(this.colorFilter)
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
