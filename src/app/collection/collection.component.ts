import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild, effect, input, signal } from '@angular/core';
import { Collection } from './collection.model';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { UrzaCard } from '../data-models/urza-card.model';
import { CardComponent } from './card/card.component';
import { FormsModule } from '@angular/forms';
import { ComparePageService } from '../pages/compare-page/compare-page.service';
import { ScryfallCardPrice } from '../data-models/scryfall-collection.model';

@Component({
    selector: 'app-collection',
    standalone: true,
    templateUrl: './collection.component.html',
    styleUrl: './collection.component.css',
    imports: [ScrollingModule, CardComponent, FormsModule]
})
export class CollectionComponent implements OnInit {
  collection = input.required<Collection>()
  cardWidth: number = 170
  cardSpacing: number = 10
  cardsDisplayed: number = 0

  name = signal<string>("")
  minCopiesOptions = [
    { value: 1, display: "At least one copy" }, 
    { value: 2, display: "At least two copies" }, 
    { value: 4, display: "At least four copies" }, 
  ]
  minCopies = signal<number>(this.minCopiesOptions[0].value)
  orderOptions = [
    { value: "number-asc", display: "By number" },
    { value: "name-asc", display: "By name" },
    { value: "convertedManaCost-desc", display: "By mana cost (desc.)" },
    { value: "convertedManaCost-asc", display: "By mana cost (asc.)" },
    { value: "type-desc", display: "By type (desc.)" },
    { value: "type-asc", display: "By type (asc.)" },
    { value: "color-desc", display: "By color (desc.)" },
    { value: "color-asc", display: "By color (asc.)" },
    { value: "prices.eur-desc", display: "By price (desc.)" },
    { value: "prices.eur-asc", display: "By price (asc.)" },
    { value: "set-asc", display: "By edition" },
    { value: "releaseDate-desc", display: "By release date (desc.)" },
    { value: "releaseDate-asc", display: "By release date (asc.)" },
    { value: "count-desc", display: "By count (desc.)" },
    { value: "count-asc", display: "By count (asc.)" },
  ]
  orderSelected = signal<string>(this.orderOptions[0].value)
  colors: string[] = ["White", "Blue", "Black", "Red", "Green", "Multicolors", "Colorless"];

  grid: UrzaCard[][] = []

  @ViewChild('viewport')
  viewport: ElementRef | undefined

  constructor(private ref: ChangeDetectorRef, private compareService: ComparePageService) {
    effect(() => {
      this.buildCardGrid()
    })
  }

  ngOnInit(): void {
    this.compareService.resultingCollectionUpdated.subscribe(_ => {
      this.buildCardGrid()
    })
  }

  @HostListener('window:resize', ['$event.target.innerWidth'])
  onResize() {
    this.buildCardGrid()
  }

  get filteredCards() {
    this.orderCards()

    return this.collection().cards.filter(card => {
      return card.name.toLowerCase().includes(this.name().toLowerCase())
        && card.count >= this.minCopies()
    })
  }
  
  getPropertyValue(object: any, path: string): any {
    return path.split('.').reduce((o, p) => o && o[p], object);
  }

  orderCards() {
    const [property, order] = this.orderSelected().split('-')

    this.collection().cards.sort((cardA, cardB) => {

      if (property === 'color') {
        // Si ce sont des couleurs Magic
        const indexA = this.colors.indexOf(cardA.color);
        const indexB = this.colors.indexOf(cardB.color);

        return order === 'asc' ? indexA - indexB : indexB - indexA;
      } else {
        let valueA = this.getPropertyValue(cardA, property)
        let valueB = this.getPropertyValue(cardB, property)
  
        // Si ce sont des nombres
        if (!isNaN(Number(valueA)) && !isNaN(Number(valueB))) {
          valueA = Number(valueA);
          valueB = Number(valueB);
          return order === 'asc' ? valueA - valueB : valueB - valueA;
        }
  
        // Si ce sont des strings
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        }

        return 0
      }
    })
  }

  buildCardGrid() {
    let width = 0
    if (this.viewport !== undefined) {
      width = this.viewport.nativeElement.offsetWidth
    }

    let nbCol = Math.floor(width / (this.cardWidth + this.cardSpacing))

    this.grid = []
    let index = 0
    let temporaryArray: UrzaCard[] = []
    this.filteredCards.forEach(card => {
      if (index % nbCol === 0 && index > 0) {
        this.grid.push(temporaryArray)
        temporaryArray = []
      }
      temporaryArray.push(card)
      index++
    })

    this.cardsDisplayed = index

    if (temporaryArray.length > 0) {
      this.grid.push(temporaryArray)
    }

    this.ref.detectChanges();
  }

}
