import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild, effect } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CardPreviewComponent } from './card-preview/card-preview.component';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { CollectionsService } from '../../services/collections.service';
import { UrzaCard } from '../../data-models/urza-card.model';
import { compareOptions, orderOptions, colors } from "./compare-page.constants";
import { FiltersComponent } from './filters/filters.component';

@Component({
    selector: 'app-compare-page',
    standalone: true,
    templateUrl: './compare-page.component.html',
    styleUrl: './compare-page.component.css',
    imports: [ScrollingModule, FormsModule, CardPreviewComponent]
})
export class ComparePageComponent {
  // Selects options
  compareOptions = compareOptions
  orderOptions = orderOptions

  // Parameters
  compareOptionSelected = compareOptions[0].value
  orderOptionSelected = orderOptions[0].value
  nbCards = this.collectionService.nbCards
  name: string = ""

  // Grid
  grid: UrzaCard[][] = []

  @ViewChild('viewport')
  viewport: ElementRef | undefined

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

  @HostListener('window:resize', ['$event.target.innerWidth'])
  onResize() {
    this.adaptCardGrid()
  }

  adaptCardGrid() {
    this.collectionService.adaptViewportSize(this.viewport !== undefined 
      ? this.viewport.nativeElement.offsetWidth : 0)
    this.collectionService.adaptCardGrid()
    this.ref.detectChanges();
  }

  openFilters() {
    this.dialogRef.open(FiltersComponent)
  }

  onNameFilterChange() {
    this.collectionService.updateName(this.name);
  }

  onCompareOptionsChange(newValue: number) {
    this.collectionService.updateCompareOptionSelected(newValue)
  }

  onOrderOptionsChange(newValue: string) {
    this.collectionService.updateOrderOptionSelected(newValue)
  }
}
