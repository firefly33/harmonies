import { describe, it, expect, beforeEach } from 'vitest';
import { useCardStatesStore } from './cardStatesStore';

describe('cardStatesStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    useCardStatesStore.getState().resetCardUsages();
  });

  it('should start with empty card usages', () => {
    const { cardUsages, getCardUsage } = useCardStatesStore.getState();
    expect(cardUsages.size).toBe(0);
    expect(getCardUsage('test-card')).toBe(0);
  });

  it('should increment card usage correctly', () => {
    const { getCardUsage, incrementCardUsage } = useCardStatesStore.getState();
    
    // First increment
    const newUsage1 = incrementCardUsage('test-card', 2);
    expect(newUsage1).toBe(1);
    expect(getCardUsage('test-card')).toBe(1);
    
    // Second increment
    const newUsage2 = incrementCardUsage('test-card', 2);
    expect(newUsage2).toBe(2);
    expect(getCardUsage('test-card')).toBe(2);
  });

  it('should not exceed max usage', () => {
    const { getCardUsage, incrementCardUsage } = useCardStatesStore.getState();
    
    // Increment to max
    incrementCardUsage('test-card', 2);
    incrementCardUsage('test-card', 2);
    
    // Try to increment beyond max
    const newUsage = incrementCardUsage('test-card', 2);
    expect(newUsage).toBe(2); // Should remain at max
    expect(getCardUsage('test-card')).toBe(2);
  });

  it('should handle multiple cards independently', () => {
    const { getCardUsage, incrementCardUsage } = useCardStatesStore.getState();
    
    incrementCardUsage('card-1', 3);
    incrementCardUsage('card-2', 3);
    incrementCardUsage('card-1', 3); // card-1 now at 2
    
    expect(getCardUsage('card-1')).toBe(2);
    expect(getCardUsage('card-2')).toBe(1);
    expect(getCardUsage('card-3')).toBe(0); // Non-existent card
  });

  it('should reset all card usages', () => {
    const { getCardUsage, incrementCardUsage, resetCardUsages } = useCardStatesStore.getState();
    
    // Set some usages
    incrementCardUsage('card-1', 3);
    incrementCardUsage('card-2', 3);
    
    expect(getCardUsage('card-1')).toBe(1);
    expect(getCardUsage('card-2')).toBe(1);
    
    // Reset
    resetCardUsages();
    
    expect(getCardUsage('card-1')).toBe(0);
    expect(getCardUsage('card-2')).toBe(0);
  });
});