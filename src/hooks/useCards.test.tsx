import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, beforeEach } from 'vitest';
import { useCards } from './useCards';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useCards', () => {
  beforeEach(() => {
    // Reset any query cache between tests
    const queryClient = new QueryClient();
    queryClient.clear();
  });

  it('should return cards data successfully', async () => {
    const wrapper = createWrapper();
    
    const { result } = renderHook(() => useCards(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.cards).toBeUndefined();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.cards).toBeDefined();
    expect(Array.isArray(result.current.cards)).toBe(true);
    expect(result.current.cards!.length).toBeGreaterThan(0);
  });

  it('should return cards with correct structure', async () => {
    const wrapper = createWrapper();
    
    const { result } = renderHook(() => useCards(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const cards = result.current.cards!;
    const firstCard = cards[0];

    expect(firstCard).toHaveProperty('id');
    expect(firstCard).toHaveProperty('animalName');
    expect(firstCard).toHaveProperty('description');
    expect(firstCard).toHaveProperty('pattern');
    expect(firstCard).toHaveProperty('maxUsage');
    expect(firstCard).toHaveProperty('currentUsage');
    expect(typeof firstCard.id).toBe('string');
    expect(typeof firstCard.animalName).toBe('string');
    expect(typeof firstCard.maxUsage).toBe('number');
    expect(typeof firstCard.currentUsage).toBe('number');
  });

  it('should include specific expected cards', async () => {
    const wrapper = createWrapper();
    
    const { result } = renderHook(() => useCards(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const cards = result.current.cards!;
    const cardNames = cards.map(card => card.animalName);

    expect(cardNames).toContain('Raton-laveur');
    expect(cards.length).toBe(1);
  });

  it('should provide correct loading states', () => {
    const wrapper = createWrapper();
    
    const { result } = renderHook(() => useCards(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBe(null);
  });
});