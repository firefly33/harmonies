import { useState } from 'react';
import { type Card as CardType } from '../../types/Card';
import { useCards } from '../../hooks/useCards';
import Card from '../../components/Card';

interface CardsDeckProps {
  onCardClick?: (card: CardType) => void;
}

const CardsDeck = ({ onCardClick }: CardsDeckProps) => {
  const { cards, isLoading, error, isError } = useCards();
  const [cardStates, setCardStates] = useState<Map<string, number>>(new Map());

  const handleCardClick = (card: CardType) => {
    console.log('Card clicked:', card.animalName);
    
    // Call the external handler first (for board integration)
    if (onCardClick) {
      onCardClick(card);
    }
    
    // Toggle usage state for demonstration
    setCardStates(prev => {
      const newStates = new Map(prev);
      const currentUsage = newStates.get(card.id) || 0;
      const newUsage = currentUsage < card.maxUsage ? currentUsage + 1 : 0;
      newStates.set(card.id, newUsage);
      return newStates;
    });
  };

  if (isLoading) {
    return (
      <section className="mt-8 p-4">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Les cartes disponibles
        </h2>
        <div className="flex justify-center">
          <div className="text-lg">Chargement des cartes...</div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mt-8 p-4">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Les cartes disponibles
        </h2>
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
      <section className="mt-8 p-4">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Les cartes disponibles
        </h2>
        <div className="flex justify-center">
          <div className="text-lg">Aucune carte disponible</div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Les cartes disponibles
      </h2>
      <div className="flex gap-4 justify-center flex-wrap">
        {cards.map((card) => {
          const cardWithUsage = {
            ...card,
            currentUsage: cardStates.get(card.id) || 0
          };
          
          return (
            <Card
              key={card.id}
              card={cardWithUsage}
              onClick={handleCardClick}
              className="hover:scale-105 transition-transform"
            />
          );
        })}
      </div>
    </section>
  );
};
export default CardsDeck

