import { Component, input } from '@angular/core'

@Component({
  selector: 'app-card-row',
  standalone: true,
  imports: [],
  templateUrl: './card-row.component.html',
  styleUrl: './card-row.component.css'
})
export class CardRowComponent {
  key = input.required<string>()
  value = input.required<string>()
}
