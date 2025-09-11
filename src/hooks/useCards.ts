import { useQuery } from '@tanstack/react-query';
import { getCards } from '../services/CardService';
import type { Card as CardType } from '../types/Card';

export const useCards = () => {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['cards'],
    queryFn: getCards,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  return {
    cards: data,
    isLoading,
    error,
    isError,
  };
};

export type { CardType };