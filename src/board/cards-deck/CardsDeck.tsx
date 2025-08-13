import { useState } from 'react';
import {type Card as CardType, createCardPattern } from '../../types/Card';
import { createAnimalCard, createQuickCard, ExampleCards } from '../../utils/CardPatternBuilder';
import Card from '../../components/Card';

// Easy way to define animal cards - just change these patterns as needed!
const cards: CardType[] = [
  // Method 1: Use the builder pattern for complex cards
  createAnimalCard('1', 'Raton-laveur')
    .addCell(0, 0, ['field'])     // This is where the animal will be placed
    .addCell(0, 1, ['water'])
    .addCell(1, 0, ['water'])
    .addCell(-1, 1, ['water'])
    .withPlacementCell(0, 0)      // Animal placed on the field token
    .withMaxUsage(2)              // Can be used 2 times
    .withDescription('Un voleur de poubelles')
    .build(),

  // Method 2: Use quick templates for simple patterns
  createQuickCard('rabbit', 'Lapin', 'horizontalLine', 3, ['field', 'brown', 'field']),

  // Method 3: Use predefined example cards
  ExampleCards.beaver,
  ExampleCards.eagle,

  // Method 4: Direct pattern creation (most flexible)
  {
    id: 'fox',
    animalName: 'Renard',
    description: 'Rusé habitant des villages et forêts',
    pattern: createCardPattern([
      { q: 0, r: 0, tokenTypes: ['house'] },      // Placed on house
      { q: 1, r: -1, tokenTypes: ['brown', 'tree'] },
      { q: -1, r: 1, tokenTypes: ['field'] }
    ], { q: 0, r: 0 }), // Animal placed on house
    maxUsage: 1,
    currentUsage: 0
  },

  // Method 5: Create a more complex card easily
  createAnimalCard('dragon', 'Dragon')
    .addCell(0, 0, ['mountain', 'mountain', 'mountain'])
    .addCell(0, 1, ['mountain', 'mountain'])
    .addCell(-1, 0, ['mountain'])
    .addCell(1, 0, ['mountain'])
    .addCell(0, -1, ['house'])
    .withPlacementCell(0, 0)  // Animal placed on the tallest mountain
    .withMaxUsage(1)          // Legendary creature - can only be used once
    .withDescription('Créature légendaire des hautes montagnes')
    .build()
];

const CardsDeck = () => {
  const [cardStates, setCardStates] = useState<Map<string, number>>(new Map());

  const handleCardClick = (card: CardType) => {
    console.log('Card clicked:', card.animalName);
    
    // Toggle usage state for demonstration
    setCardStates(prev => {
      const newStates = new Map(prev);
      const currentUsage = newStates.get(card.id) || 0;
      const newUsage = currentUsage < card.maxUsage ? currentUsage + 1 : 0;
      newStates.set(card.id, newUsage);
      return newStates;
    });
  };

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

