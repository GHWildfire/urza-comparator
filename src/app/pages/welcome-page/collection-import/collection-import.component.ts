import { Component, OnInit, input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CSVCollection } from '../../../data-models/csv-collection.model';
import { CollectionsService } from '../../../services/collections.service';
import { CSVService } from '../../../services/csv.service';

@Component({
  selector: 'app-collection-import',
  standalone: true,
  imports: [MatProgressBarModule],
  templateUrl: './collection-import.component.html',
  styleUrl: './collection-import.component.scss'
})
export class CollectionImportComponent implements OnInit {
  isLeft = input.required<boolean>()
  file: any
  imageURL: string = ""
  progress = 0

  constructor(
    private collectionsService: CollectionsService,
    private csvService: CSVService
  ) {}

  ngOnInit(): void {
    this.csvService.csvLoading.subscribe(loading => {
      if (this.isLeft() === loading.isLeft) {
        this.progress = loading.progress
      }
    })

    this.collectionsService.clearImportedCollection(this.isLeft())
  }

  clearFile() {
    this.file = undefined
    this.progress = 0
    this.collectionsService.clearImportedCollection(this.isLeft())
  }

  loadCSV(event: any) {
    const reader = new FileReader();
    this.file = event.target.files[0]
    reader.onload = async () => {
      const fileContent: string = reader.result as string
      const lines: string[] = fileContent.split(/[\r\n]+/g)

      if (lines.length > 2) {
        let separator = ","

        const firstLine = lines[0]
        
        if (firstLine.includes("sep=") && firstLine.length >= 7) {
          separator = lines[0].slice(5, 6)
        }

        const headers = lines[1].split(separator)
        const csvCollection = new CSVCollection(this.file, separator, headers, lines.slice(2), this.isLeft())
        this.csvService.csvToCollection(csvCollection)
      }
    }

    reader.readAsText(this.file)
  }
}
