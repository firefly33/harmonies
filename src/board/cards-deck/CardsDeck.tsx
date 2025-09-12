import { useState, forwardRef, useImperativeHandle } from 'react';
import { type Card as CardType } from '../../types/Card';
import { useCards } from '../../hooks/useCards';
import Card from '../../components/Card';

interface CardsDeckProps {
  onCardClick?: (card: CardType) => void;
  onCardPlaced?: (cardId: string) => void;
}

export interface CardsDeckRef {
  cardPlaced: (cardId: string) => void;
}

const CardsDeck = forwardRef<CardsDeckRef, CardsDeckProps>(({ onCardClick, onCardPlaced }, ref) => {
  const { cards, isLoading, error, isError } = useCards();
  const [cardStates, setCardStates] = useState<Map<string, number>>(new Map());

  const handleCardClick = (card: CardType) => {
    const currentUsage = cardStates.get(card.id) || 0;
    
    // Don't allow selection if card is fully used
    if (currentUsage >= card.maxUsage) {
      return;
    }

    console.log('Card clicked:', card.animalName);
    
    // Call the external handler for board integration
    if (onCardClick) {
      onCardClick(card);
    }
  };

  // Function to be called when an animal is successfully placed
  const handleCardPlaced = (cardId: string) => {
    setCardStates(prev => {
      const newStates = new Map(prev);
      const currentUsage = newStates.get(cardId) || 0;
      const newUsage = Math.min(currentUsage + 1, cards?.find(c => c.id === cardId)?.maxUsage || 0);
      newStates.set(cardId, newUsage);
      return newStates;
    });
    
    if (onCardPlaced) {
      onCardPlaced(cardId);
    }
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    cardPlaced: handleCardPlaced
  }));

  if (isLoading) {
    return (
      <section className="w-full">
        <div className="flex justify-center">
          <div className="text-lg">Chargement des cartes...</div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="w-full">
        <div className="flex justify-center">
          <div className="text-lg text-red-600">
            Erreur lors du chargement des cartes: {error?.message || 'Erreur inconnue'}
          </div>
        </div>
      </section>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <section className="w-full">
        <div className="flex justify-center">
          <div className="text-lg">Aucune carte disponible</div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <div className="flex flex-col gap-4">
        {cards.map((card) => {
          const currentUsage = cardStates.get(card.id) || 0;
          const isDisabled = currentUsage >= card.maxUsage;
          const cardWithUsage = {
            ...card,
            currentUsage
          };
          
          return (
            <Card
              key={card.id}
              card={cardWithUsage}
              onClick={handleCardClick}
              className={`transition-transform w-full ${
                isDisabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:scale-105 cursor-pointer'
              }`}
            />
          );
        })}
      </div>
    </section>
  );
});

CardsDeck.displayName = 'CardsDeck';

export default CardsDeck;

