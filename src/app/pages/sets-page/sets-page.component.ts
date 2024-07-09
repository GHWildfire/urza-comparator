import { Component, ViewChild } from '@angular/core'
import { SetsPageService } from './sets-page.service'
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling'
import { SetsPageRowComponent } from './sets-page-row/sets-page-row.component'

@Component({
  selector: 'app-sets-page',
  standalone: true,
  imports: [ScrollingModule, SetsPageRowComponent],
  templateUrl: './sets-page.component.html',
  styleUrl: './sets-page.component.scss'
})
export class SetsPageComponent {

  @ViewChild('cdkViewport') cdkViewport: CdkVirtualScrollViewport | undefined

  constructor(
    public setsPageService: SetsPageService
  ) {}

}
