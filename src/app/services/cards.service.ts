import { Injectable } from "@angular/core";
import { UrzaCard } from "../data-models/urza-card.model";

@Injectable({ providedIn: 'root' })
export class CardsService {

    averagePrice(card: UrzaCard): string {
        return card.prices && card.prices.eur ? "€" + card.prices.eur : "No price found"
    }

    averagePriceFoil(card: UrzaCard): string {
        return card.prices && card.prices.eur_foil 
            ? "€" + card.prices.eur_foil 
            : this.averagePrice(card)
    }

    orderingPrice(card: UrzaCard): number {
        if (!card.prices) return 0
        if (card.prices.eur) return +card.prices.eur
        if (!card.prices.eur && card.prices.eur_foil) return +card.prices.eur_foil
        return 0
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