import {type Card as CardType, createCardPattern } from '../../types/Card';
import { createAnimalCard, createQuickCard, ExampleCards } from '../../utils/CardPatternBuilder';
import Card from '../../components/Card';

// Easy way to define animal cards - just change these patterns as needed!
const cards: CardType[] = [
  // Method 1: Use the builder pattern for complex cards
  createAnimalCard('1', 'Raton-laveur')
    .addCell(0, 0, ['field'])
    .addCell(0, 1, ['water'])
    .addCell(1, 0, ['water'])
    .addCell(-1, 1, ['water'])
    .withDescription('Un vouleur de poubelles')
    .build(),

  // Method 2: Use quick templates for simple patterns
  createQuickCard('rabbit', 'Lapin', 'horizontalLine', ['field', 'brown', 'field']),

  // Method 3: Use predefined example cards
  ExampleCards.beaver,
  ExampleCards.eagle,

  // Method 4: Direct pattern creation (most flexible)
  {
    id: 'fox',
    animalName: 'Renard',
    description: 'Rusé habitant des villages et forêts',
    pattern: createCardPattern([
      { q: 0, r: 0, tokenTypes: ['house'] },
      { q: 1, r: -1, tokenTypes: ['brown', 'tree'] },
      { q: -1, r: 1, tokenTypes: ['field'] }
    ])
  },

  // Method 5: Create a more complex card easily
  createAnimalCard('dragon', 'Dragon')
    .addCell(0, 0, ['mountain', 'mountain', 'mountain'])
    .addCell(0, 1, ['mountain', 'mountain'])
    .addCell(-1, 0, ['mountain'])
    .addCell(1, 0, ['mountain'])
    .addCell(0, -1, ['house'])
    .withDescription('Créature légendaire des hautes montagnes')
    .build()
];

const CardsDeck = () => {
  const handleCardClick = (card: CardType) => {
    console.log('Card clicked:', card.animalName);
    // You can add logic here for card selection, etc.
  };

  return (
    <section className="mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Les cartes disponibles
      </h2>
      <div className="flex gap-4 justify-center flex-wrap">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onClick={handleCardClick}
            className="hover:scale-105 transition-transform"
          />
        ))}
      </div>
    </section>
  );
};
export default CardsDeck

