import { Component, input, output } from '@angular/core'

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss'
})
export class TagComponent {
  option = input.required<string>()
  delete = output<string>()
}
