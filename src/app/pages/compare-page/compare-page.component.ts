import { AfterViewInit, ChangeDetectorRef, Component, HostListener, ViewChild, effect } from '@angular/core'
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling'
import { CardPreviewComponent } from './card-preview/card-preview.component'
import { FormsModule } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { CollectionsService } from '../../services/collections.service'
import { UrzaCard } from '../../data-models/urza-card.model'
import { compareOptions, orderOptions } from "./compare-page.constants"
import { FiltersComponent } from './filters/filters.component'

@Component({
    selector: 'app-compare-page',
    standalone: true,
    templateUrl: './compare-page.component.html',
    styleUrl: './compare-page.component.scss',
    imports: [ScrollingModule, FormsModule, CardPreviewComponent]
})
export class ComparePageComponent implements AfterViewInit {
  // Selects options
  compareOptions = compareOptions
  orderOptions = orderOptions

  // Parameters
  compareOptionSelected = compareOptions[0].value
  orderOptionSelected = orderOptions[0].value
  name: string = ""
  screenWidth: number = 0
  cardZoom: number = 1
  baseWidth: number = 170
  baseHeight: number = 234

  // Grid
  grid: UrzaCard[][] = []
  cards: UrzaCard[] = []

  @ViewChild('cdkViewport') cdkViewport: CdkVirtualScrollViewport | undefined

  constructor(
    private ref: ChangeDetectorRef, 
    private dialogRef: MatDialog,
    private collectionService: CollectionsService
  ) {
    effect(() => {
      this.adaptCardGrid()
    })
  }

  ngOnInit(): void {
    this.collectionService.gridUpdated.subscribe(result => {
      this.grid = result.grid
      this.cards = result.cards
    })
    this.name = this.collectionService.nameFilter
    this.compareOptionSelected = this.collectionService.compareOptionSelected
    this.orderOptionSelected = this.collectionService.orderOptionSelected
    this.cardZoom = this.collectionService.cardZoom
    this.adaptCardGrid()
  }

  ngAfterViewInit(): void {
    if (this.cdkViewport) {
      setTimeout(() => {
        this.cdkViewport?.scrollToIndex(this.collectionService.selectedCardIndex - 1)
      }, 0)
    }
    this.adaptCardGrid()
  }

  @HostListener('window:resize', ['$event.target.innerWidth'])
  onResize() {
    this.adaptCardGrid()
  }

  get zoomedWidth(): string {
    return `${this.baseWidth * (this.smallScreen ? 1 : this.cardZoom)}px`
  }

  get zoomedHeight(): string {
    return `${this.baseHeight * (this.smallScreen ? 1 : this.cardZoom)}px`
  }

  get itemSize(): number {
    return (this.baseHeight + 10) * (this.smallScreen ? 1 : this.cardZoom)
  }

  get smallScreen(): boolean {
    return this.screenWidth <= 860
  }

  adaptCardGrid() {
    this.screenWidth = this.cdkViewport?.elementRef !== undefined ? this.cdkViewport?.elementRef.nativeElement.offsetWidth : 0
    this.collectionService.adaptViewportSize(this.screenWidth)
    this.ref.detectChanges()
  }

  adaptCardZoom() {
    this.collectionService.adaptCardZoom((this.smallScreen ? 1 : this.cardZoom))
  }

  openFilters() {
    this.dialogRef.open(FiltersComponent, {
      panelClass: 'custom-dialog'
    })
  }

  onNameFilterChange() {
    this.collectionService.updateName(this.name)
  }

  onCompareOptionsChange(newValue: number) {
    this.collectionService.updateCompareOptionSelected(newValue)
  }

  onOrderOptionsChange(newValue: string) {
    this.collectionService.updateOrderOptionSelected(newValue)
  }
}
