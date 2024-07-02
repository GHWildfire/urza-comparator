import { AfterViewInit, ChangeDetectorRef, Component, HostListener, ViewChild, effect } from '@angular/core'
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling'
import { CardPreviewComponent } from './card-preview/card-preview.component'
import { FormsModule } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { CollectionsService } from '../../services/collections.service'
import { UrzaCard } from '../../data-models/urza-card.model'
import { compareOptions, orderOptions, colors } from "./compare-page.constants"
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
  nbCards = this.collectionService.nbCards
  name: string = ""
  screenWidth: number = 0

  // Grid
  grid: UrzaCard[][] = []

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
    this.collectionService.gridUpdated.subscribe(newGrid => {
      this.grid = newGrid
      this.nbCards = this.collectionService.nbCards
    })
  }

  ngAfterViewInit(): void {
    if (this.cdkViewport) {
      setTimeout(() => {
        this.cdkViewport?.scrollToIndex(this.collectionService.selectedCardIndex - 1)
      }, 0)
    }
  }

  @HostListener('window:resize', ['$event.target.innerWidth'])
  onResize() {
    this.adaptCardGrid()
  }

  adaptCardGrid() {
    this.screenWidth = this.cdkViewport?.elementRef !== undefined ? this.cdkViewport?.elementRef.nativeElement.offsetWidth : 0
    this.collectionService.adaptViewportSize(this.screenWidth)
    this.collectionService.adaptCardGrid()
    this.ref.detectChanges()
  }

  openFilters() {
    this.dialogRef.open(FiltersComponent)
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
