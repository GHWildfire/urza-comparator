import { Injectable } from "@angular/core";
import { UrzaCard } from "../data-models/urza-card.model";

@Injectable({ providedIn: 'root' })
export class CardsService {

    averagePrice(card: UrzaCard): string {
        return card.scryfallData?.prices && card.scryfallData?.prices.eur ? "€" + card.scryfallData?.prices.eur : "No price found"
    }

    averagePriceFoil(card: UrzaCard): string {
        return card.scryfallData?.prices && card.scryfallData?.prices.eur_foil 
            ? "€" + card.scryfallData?.prices.eur_foil 
            : this.averagePrice(card)
    }

    orderingPrice(card: UrzaCard): number {
        if (!card.scryfallData?.prices) return 0
        if (card.scryfallData?.prices.eur) return +card.scryfallData?.prices.eur
        if (!card.scryfallData?.prices.eur && card.scryfallData?.prices.eur_foil) return +card.scryfallData?.prices.eur_foil
        return 0
    }

    collectionValue(card: UrzaCard): string {
        let total = 0
        if (card.scryfallData?.prices && card.scryfallData?.prices.eur) {
            total += (card.count - card.foilCount) * +card.scryfallData?.prices.eur
        }
        if (card.scryfallData?.prices && card.scryfallData?.prices.eur_foil) {
            total += card.foilCount * +card.scryfallData?.prices.eur_foil
        }
        return "€" + total
    }
}