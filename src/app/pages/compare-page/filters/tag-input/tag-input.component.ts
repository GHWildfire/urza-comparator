import { Component, input, OnInit, output } from '@angular/core'
import { TagComponent } from "./tag/tag.component"

@Component({
  selector: 'app-tag-input',
  standalone: true,
  imports: [TagComponent],
  templateUrl: './tag-input.component.html',
  styleUrl: './tag-input.component.css'
})
export class TagInputComponent implements OnInit {
  title = input.required<string>()
  options = input.required<any[]>()
  selectionChanged = output<any[]>()
  initSelectedOptions = input.required<any[]>()

  selectedOptions: string[] = []

  ngOnInit(): void {
    this.selectedOptions = this.initSelectedOptions().map((option) => option.name)
  }

  addSelectedOption(event: any) {
    const selectedOption: any = this.options()[event.target.value]
    if (selectedOption && !this.selectedOptions.includes(selectedOption.name)) {
      this.selectedOptions.push(selectedOption.name);
    }
    event.target.value = -1;
    this.updateSelection()
  }

  optionDeleted(option: string) {
    const index = this.selectedOptions.indexOf(option)
    if (index >= 0) {
      this.selectedOptions.splice(index, 1)
    }
    this.updateSelection()
  }

  reset() {
    this.selectedOptions = []
    this.updateSelection()
  }

  updateSelection() {
    const selection = this.options().filter((option) => this.selectedOptions.includes(option.name))
    this.selectionChanged.emit(selection)
  }
}
