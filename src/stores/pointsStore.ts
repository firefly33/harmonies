import { create } from 'zustand';
import { type Card } from '../types/Card';

interface PointsState {
  totalPoints: number;
  cardPoints: number;
  tokenPoints: number;
  cardUsagePoints: Map<string, number[]>; // cardId -> points per usage
  awardAnimalCardPoints: (card: Card, usageIndex: number) => number;
  awardPointsDirectly: (points: number) => void;
  awardPointsSeparately: (cardPoints: number, tokenPoints: number) => void;
  resetPoints: () => void;
}

export const usePointsStore = create<PointsState>((set) => ({
  totalPoints: 0,
  cardPoints: 0,
  tokenPoints: 0,
  cardUsagePoints: new Map(),

  awardAnimalCardPoints: (card: Card, usageIndex: number) => {
    const pointsAwarded = card.pointsPerUsage[usageIndex] || 0;

    if (pointsAwarded > 0) {
      set((state) => {
        const newCardUsagePoints = new Map(state.cardUsagePoints);
        const cardPoints = newCardUsagePoints.get(card.id) || [];
        cardPoints[usageIndex] = pointsAwarded;
        newCardUsagePoints.set(card.id, cardPoints);

        return {
          totalPoints: state.totalPoints + pointsAwarded,
          cardUsagePoints: newCardUsagePoints
        };
      });
    }

    return pointsAwarded;
  },

  awardPointsDirectly: (points: number) => {
    if (points > 0) {
      set((state) => ({
        totalPoints: state.totalPoints + points
      }));
    }
  },

  awardPointsSeparately: (cardPoints: number, tokenPoints: number) => {
    set({
      cardPoints,
      tokenPoints,
      totalPoints: cardPoints + tokenPoints
    });
  },

  resetPoints: () => {
    set({
      totalPoints: 0,
      cardPoints: 0,
      tokenPoints: 0,
      cardUsagePoints: new Map()
    });
  }
}));
