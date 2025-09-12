import { type Card as CardType } from '../../types/Card';
import { useCardStatesStore } from '../../stores/cardStatesStore';
import Card from '../../components/Card';

interface CardsDeckProps {
  cards: CardType[];
  onCardClick?: (card: CardType) => void;
}

const CardsDeck = ({ cards, onCardClick }: CardsDeckProps) => {
  const { getCardUsage } = useCardStatesStore();

  const handleCardClick = (card: CardType) => {
    const currentUsage = getCardUsage(card.id);

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
          const currentUsage = getCardUsage(card.id);
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
};

export default CardsDeck;

