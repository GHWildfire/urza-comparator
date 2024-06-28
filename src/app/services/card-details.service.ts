import { Injectable } from "@angular/core";
import { UrzaCard } from "../data-models/urza-card.model";

@Injectable({ providedIn: 'root' })
export class CardDetailsService {

    averagePrice(card: UrzaCard): string {
        return card.prices && card.prices.eur ? "€" + card.prices.eur : "No price found"
    }

    averagePriceFoil(card: UrzaCard): string {
        return card.prices && card.prices.eur_foil 
            ? "€" + card.prices.eur_foil 
            : this.averagePrice(card)
    }

    collectionValue(card: UrzaCard): string {
        let total = 0
        if (card.prices && card.prices.eur) {
            total += (card.count - card.foilCount) * +card.prices.eur
        }
        if (card.prices && card.prices.eur_foil) {
            total += card.foilCount * +card.prices.eur_foil
        }
        return "€" + total
    }
}