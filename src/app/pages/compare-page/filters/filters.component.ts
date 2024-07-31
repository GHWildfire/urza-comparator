import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core'
import { ColorFilterComponent } from "./color-filter/color-filter.component"
import { FormsModule } from '@angular/forms'
import { RarityFilterComponent } from "./rarity-filter/rarity-filter.component"
import { CollectionsService } from '../../../services/collections.service'
import { MatDialogModule } from '@angular/material/dialog'
import { ScryfallAPIService } from '../../../services/scryfall-api.service'
import { Scryfall } from '../../../data-models/scryfall-models/scryfall.model'
import { ScryfallSet } from '../../../data-models/scryfall-models/scryfall-set.model'
import { TagComponent } from './tag-input/tag/tag.component'
import { TagInputComponent } from "./tag-input/tag-input.component"
import { Filters } from '../../../data-models/filter-models/filters.model'
import { RarityFilter } from '../../../data-models/filter-models/rarity-filter.model'
import { ColorFilter } from '../../../data-models/filter-models/color-filter.model'

@Component({
    selector: 'app-filters',
    standalone: true,
    templateUrl: './filters.component.html',
    styleUrl: './filters.component.scss',
    imports: [ColorFilterComponent, FormsModule, RarityFilterComponent, MatDialogModule, TagComponent, TagInputComponent]
})
export class FiltersComponent implements OnInit {
  name: string = ""
  scryfall?: Scryfall
  filters: Filters = new Filters

  @ViewChildren(ColorFilterComponent) colorFilters!: QueryList<ColorFilterComponent>
  @ViewChild(RarityFilterComponent) rarityFilter!: RarityFilterComponent
  @ViewChildren(TagInputComponent) tagInputs!: QueryList<TagInputComponent>

  constructor(
    public collectionService: CollectionsService,
    public scryfallService: ScryfallAPIService
  ) {}

  ngOnInit(): void {
    this.scryfall = this.scryfallService.scryfall
    this.scryfallService.scryfallLoaded.subscribe((scryfall) => {
      this.scryfall = scryfall
    })

    this.filters = this.collectionService.filters
  }

  get sets() {
    if (!this.scryfall) return []
    return this.scryfall.sets.sort((setA, setB) => setA.name?.localeCompare(setB.name!) ?? 0)
  }

  get artists() {
    if (!this.scryfall) return []
    return this.scryfall.artists.sort((artistA, artistB) => artistA?.localeCompare(artistB!) ?? 0)
  }

  get types() {
    if (!this.scryfall) return []
    return this.scryfall.cardTypes.sort((typeA, typeB) => typeA?.localeCompare(typeB!) ?? 0)
  }

  get superTypes() {
    if (!this.scryfall) return []
    return this.scryfall.superTypes.sort((typeA, typeB) => typeA?.localeCompare(typeB!) ?? 0)
  }

  get artifactTypes() {
    if (!this.scryfall) return []
    return this.scryfall.artifactTypes.sort((typeA, typeB) => typeA?.localeCompare(typeB!) ?? 0)
  }

  get spellTypes() {
    if (!this.scryfall) return []
    return this.scryfall.spellTypes.sort((typeA, typeB) => typeA?.localeCompare(typeB!) ?? 0)
  }

  get creatureTypes() {
    if (!this.scryfall) return []
    return this.scryfall.creatureTypes.sort((typeA, typeB) => typeA?.localeCompare(typeB!) ?? 0)
  }

  get enchantmentTypes() {
    if (!this.scryfall) return []
    return this.scryfall.enchantmentTypes.sort((typeA, typeB) => typeA?.localeCompare(typeB!) ?? 0)
  }

  get landTypes() {
    if (!this.scryfall) return []
    return this.scryfall.landTypes.sort((typeA, typeB) => typeA?.localeCompare(typeB!) ?? 0)
  }

  get planeswalkerTypes() {
    if (!this.scryfall) return []
    return this.scryfall.planeswalkerTypes.sort((typeA, typeB) => typeA?.localeCompare(typeB!) ?? 0)
  }

  get battleTypes() {
    if (!this.scryfall) return []
    return this.scryfall.battleTypes.sort((typeA, typeB) => typeA?.localeCompare(typeB!) ?? 0)
  }

  updateRarities(rarityFilter: RarityFilter) {
    this.filters.rarityFilter = rarityFilter
    this.updateFilters()
  }

  updateColors(colorFilter: ColorFilter) {
    this.filters.colorFilter = colorFilter
    this.updateFilters()
  }

  updateReverseColors(colorFilter: ColorFilter) {
    this.filters.colorUnfilter = colorFilter
    this.updateFilters()
  }

  updateSets(sets: ScryfallSet[]) {
    this.filters.sets = sets
    this.updateFilters()
  }

  updateArtists(artists: string[]) {
    this.filters.artists = artists
    this.updateFilters()
  }

  updateTypes(types: string[]) {
    this.filters.types = types
    this.updateFilters()
  }

  updateSupertypes(superTypes: string[]) {
    this.filters.superTypes = superTypes
    this.updateFilters()
  }

  updateArtifactTypes(artifactTypes: string[]) {
    this.filters.artifactTypes = artifactTypes
    this.updateFilters()
  }

  updateSpellTypes(spellTypes: string[]) {
    this.filters.spellTypes = spellTypes
    this.updateFilters()
  }

  updateCreatureTypes(creatureTypes: string[]) {
    this.filters.creatureTypes = creatureTypes
    this.updateFilters()
  }

  updateEnchantmentTypes(enchantmentTypes: string[]) {
    this.filters.enchantmentTypes = enchantmentTypes
    this.updateFilters()
  }

  updateLandTypes(landTypes: string[]) {
    this.filters.landTypes = landTypes
    this.updateFilters()
  }

  updatePlaneswalkerTypes(planeswalkerTypes: string[]) {
    this.filters.planeswalkerTypes = planeswalkerTypes
    this.updateFilters()
  }

  updateBattleTypes(battleTypes: string[]) {
    this.filters.battleTypes = battleTypes
    this.updateFilters()
  }

  updateFilters() {
    this.collectionService.updateFilters(this.filters)
  }
  
  resetAllFilters() {
    // Basic filters
    this.name = ""
    this.collectionService.updateName(this.name)
    
    // Advanced filters
    this.colorFilters.forEach((colorFilter) => {
      colorFilter.reset()
    })
    this.rarityFilter.reset()
    this.tagInputs.forEach((tagInput) => {
      tagInput.reset()
    })
  }
}
