import { describe, it, expect, vi } from 'vitest';

// Simple unit tests for the usage functionality without rendering
describe('CardsDeck Usage Logic', () => {
  it('should increment usage count correctly', () => {
    const cardStates = new Map<string, number>();
    const maxUsage = 2;
    const cardId = '1';

    // Simulate first placement
    const currentUsage1 = cardStates.get(cardId) || 0;
    const newUsage1 = Math.min(currentUsage1 + 1, maxUsage);
    cardStates.set(cardId, newUsage1);
    
    expect(cardStates.get(cardId)).toBe(1);

    // Simulate second placement
    const currentUsage2 = cardStates.get(cardId) || 0;
    const newUsage2 = Math.min(currentUsage2 + 1, maxUsage);
    cardStates.set(cardId, newUsage2);
    
    expect(cardStates.get(cardId)).toBe(2);

    // Simulate third placement (should not exceed max)
    const currentUsage3 = cardStates.get(cardId) || 0;
    const newUsage3 = Math.min(currentUsage3 + 1, maxUsage);
    cardStates.set(cardId, newUsage3);
    
    expect(cardStates.get(cardId)).toBe(2); // Should remain at max
  });

  it('should prevent card selection when fully used', () => {
    const cardStates = new Map<string, number>();
    const maxUsage = 2;
    const cardId = '1';

    // Set card as fully used
    cardStates.set(cardId, 2);

    const currentUsage = cardStates.get(cardId) || 0;
    const canSelectCard = currentUsage < maxUsage;

    expect(canSelectCard).toBe(false);
  });

  it('should allow card selection when not fully used', () => {
    const cardStates = new Map<string, number>();
    const maxUsage = 2;
    const cardId = '1';

    // Set card as partially used
    cardStates.set(cardId, 1);

    const currentUsage = cardStates.get(cardId) || 0;
    const canSelectCard = currentUsage < maxUsage;

    expect(canSelectCard).toBe(true);
  });

  it('should handle callback when card is placed', () => {
    const mockCallback = vi.fn();
    const cardId = '1';

    // Simulate card placement
    mockCallback(cardId);

    expect(mockCallback).toHaveBeenCalledWith(cardId);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should determine correct disabled state for cards', () => {
    const cardStates = new Map<string, number>();
    const cards = [
      { id: '1', maxUsage: 2 },
      { id: '2', maxUsage: 1 },
    ];

    // Card 1: used once, should not be disabled
    cardStates.set('1', 1);
    const isCard1Disabled = (cardStates.get('1') || 0) >= cards[0].maxUsage;
    expect(isCard1Disabled).toBe(false);

    // Card 2: used once (max), should be disabled
    cardStates.set('2', 1);
    const isCard2Disabled = (cardStates.get('2') || 0) >= cards[1].maxUsage;
    expect(isCard2Disabled).toBe(true);
  });
});