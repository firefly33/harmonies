import { create } from 'zustand';

interface CardStatesState {
  cardUsages: Map<string, number>; // cardId -> current usage count
  getCardUsage: (cardId: string) => number;
  incrementCardUsage: (cardId: string, maxUsage: number) => number;
  resetCardUsages: () => void;
}

export const useCardStatesStore = create<CardStatesState>((set, get) => ({
  cardUsages: new Map(),
  
  getCardUsage: (cardId: string) => {
    const { cardUsages } = get();
    return cardUsages.get(cardId) || 0;
  },
  
  incrementCardUsage: (cardId: string, maxUsage: number) => {
    const { cardUsages } = get();
    const currentUsage = cardUsages.get(cardId) || 0;
    const newUsage = Math.min(currentUsage + 1, maxUsage);
    
    set((state) => {
      const newCardUsages = new Map(state.cardUsages);
      newCardUsages.set(cardId, newUsage);
      return { cardUsages: newCardUsages };
    });
    
    return newUsage;
  },
  
  resetCardUsages: () => {
    set({ cardUsages: new Map() });
  }
}));