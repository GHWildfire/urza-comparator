import { Component, OnInit, input } from '@angular/core';
import { WelcomePageService } from '../welcome-page.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Collection } from '../../../collection/collection.model';

@Component({
  selector: 'app-collection-import',
  standalone: true,
  imports: [MatProgressBarModule],
  templateUrl: './collection-import.component.html',
  styleUrl: './collection-import.component.scss'
})
export class CollectionImportComponent implements OnInit {
  id = input.required<string>()
  file: any
  imageURL: string = ""
  progress = 0

  constructor(private cardsService: WelcomePageService) {}

  ngOnInit(): void {
    this.cardsService.collectionLoading.subscribe(loading => {
      if (this.id() === loading.importerId) {
        this.progress = loading.progress
      }
    })

    let collection = this.id() === "Importer 1" ? this.cardsService.collection1 : this.cardsService.collection2
    if (collection) {
      this.file = collection.file
      this.progress = 100
    }
  }

  clearFile() {
    this.file = undefined
    this.progress = 0
    this.cardsService.clearImportedCollection(this.id())
  }

  getFile(event: any) {
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
        this.cardsService.loadUrzaCards(this.file, separator, headers, lines.slice(2), this.id())
      }
    }

    reader.readAsText(this.file)
  }
}
