import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColorFilter } from './color-filter.model';
import { ComparePageService } from '../../compare-page.service';

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

  constructor(private compareService: ComparePageService) {}

  update() {
    this.compareService.updateColors(this.colorFilter, this.contains())
  }

  reset() {
    this.colorFilter = new ColorFilter
    this.update()
  }
}
