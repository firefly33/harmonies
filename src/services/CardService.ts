import { type Card as CardType } from '../types/Card';
import { createAnimalCard } from '../utils/CardPatternBuilder';

export const getCards = async (): Promise<CardType[]> => {
  // Simulate async data fetching - in a real app this might be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const cards: CardType[] = [
        createAnimalCard('1', 'Raton-laveur')
          .addCell(0, 0, ['field'])     // This is where the animal will be placed
          .addCell(0, 1, ['water'])
          .addCell(1, 0, ['water'])
          .addCell(-1, 1, ['water'])
          .withPlacementCell(0, 0)      // Animal placed on the field token
          .withMaxUsage(2)              // Can be used 2 times
          .withPointsPerUsage([3, 8])   // 3 points for first usage, 8 points for second usage
          .withDescription('Un voleur de poubelles')
          .build()
      ];
      resolve(cards);
    }, 100); // Small delay to simulate network request
  });
};