import { Component, input } from '@angular/core'
import { ScryfallSet } from '../../../data-models/scryfall-models/scryfall-set.model'

@Component({
  selector: 'app-sets-page-row',
  standalone: true,
  imports: [],
  templateUrl: './sets-page-row.component.html',
  styleUrl: './sets-page-row.component.css'
})
export class SetsPageRowComponent {
  pair = input.required<boolean>()
  set = input.required<ScryfallSet>()

  generateLayerArray(): number[] {
    const layer = this.set().parentLayer
    return layer ? Array.from({ length: layer }, (_, i) => i) : []
  }

  getProgress(completed: number, total: string | undefined): number {
    if (!total || isNaN(Number(total)) || Number(total) === 0) {
      return 0
    }
    const totalNum = Number(total)
    return (completed / totalNum) * 100
  }
}
