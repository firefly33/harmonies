/**
 * Easy-to-use pattern builder for creating animal cards
 *
 * Usage examples:
 *
 * // Simple wolf pattern
 * const wolf = createAnimalCard('wolf', 'Loup')
 *   .addCell(0, 0, ['water'])
 *   .addCell(0, 1, ['water'])
 *   .addCell(1, 0, ['mountain', 'mountain'])
 *   .build();
 *
 * // Complex bear pattern
 * const bear = createAnimalCard('bear', 'Ours')
 *   .addCell(0, 0, ['brown', 'brown', 'tree'])
 *   .addCell(0, 1, ['brown', 'tree'])
 *   .addCell(-1, 1, ['mountain'])
 *   .addCell(1, 0, ['water'])
 *   .withDescription('Géant des forêts')
 *   .build();
 */
import {
  type Card,
  createCardPattern
} from "../types/Card.ts";
import type {TokenType} from "./can-be-placed.ts";


interface CardBuilder {
  addCell(q: number, r: number, tokenTypes: TokenType[]): CardBuilder;
  withDescription(description: string): CardBuilder;
  withImage(image: string): CardBuilder;
  build(): Card;
}

class CardBuilderImpl implements CardBuilder {
  private cells: Array<{ q: number; r: number; tokenTypes: TokenType[] }> = [];
  private description?: string;
  private image?: string;

  private id: string;

  private animalName: string;

  constructor(
    id: string,
    animalName: string
  ) {
    this.animalName = animalName;
    this.id = id;
  }

  addCell(q: number, r: number, tokenTypes: TokenType[]): CardBuilder {
    this.cells.push({ q, r, tokenTypes });
    return this;
  }

  withDescription(description: string): CardBuilder {
    this.description = description;
    return this;
  }

  withImage(image: string): CardBuilder {
    this.image = image;
    return this;
  }

  build(): Card {
    return {
      id: this.id,
      animalName: this.animalName,
      description: this.description,
      image: this.image,
      pattern: createCardPattern(this.cells)
    };
  }
}

export const createAnimalCard = (id: string, animalName: string): CardBuilder => {
  return new CardBuilderImpl(id, animalName);
};

// Predefined common patterns for easy reuse
export const PatternTemplates = {
  // Single hexagon patterns
  singleToken: (tokenType: TokenType) => [
    { q: 0, r: 0, tokenTypes: [tokenType] }
  ],

  // Line patterns
  horizontalLine: (tokenTypes: TokenType[]) => [
    { q: -1, r: 0, tokenTypes: [tokenTypes[0]] },
    { q: 0, r: 0, tokenTypes: [tokenTypes[1] || tokenTypes[0]] },
    { q: 1, r: 0, tokenTypes: [tokenTypes[2] || tokenTypes[0]] }
  ],

  verticalLine: (tokenTypes: TokenType[]) => [
    { q: 0, r: -1, tokenTypes: [tokenTypes[0]] },
    { q: 0, r: 0, tokenTypes: [tokenTypes[1] || tokenTypes[0]] },
    { q: 0, r: 1, tokenTypes: [tokenTypes[2] || tokenTypes[0]] }
  ],

  // Triangle patterns
  triangle: (center: TokenType, corners: TokenType) => [
    { q: 0, r: 0, tokenTypes: [center] },
    { q: -1, r: 0, tokenTypes: [corners] },
    { q: 1, r: -1, tokenTypes: [corners] },
    { q: 0, r: 1, tokenTypes: [corners] }
  ],

  // Cross pattern
  cross: (center: TokenType, arms: TokenType) => [
    { q: 0, r: 0, tokenTypes: [center] },
    { q: -1, r: 0, tokenTypes: [arms] },
    { q: 1, r: 0, tokenTypes: [arms] },
    { q: 0, r: -1, tokenTypes: [arms] },
    { q: 0, r: 1, tokenTypes: [arms] }
  ],

  // L-shape pattern
  lShape: (tokenTypes: TokenType[]) => [
    { q: 0, r: 0, tokenTypes: [tokenTypes[0]] },
    { q: 0, r: 1, tokenTypes: [tokenTypes[1] || tokenTypes[0]] },
    { q: 1, r: 0, tokenTypes: [tokenTypes[2] || tokenTypes[0]] }
  ]
};

// Quick card creation with templates
export const createQuickCard = (
  id: string,
  animalName: string,
  template: keyof typeof PatternTemplates,
  ...args: any[]
): Card => {
  const pattern = (PatternTemplates[template] as any)(...args);
  return {
    id,
    animalName,
    pattern: createCardPattern(pattern)
  };
};

// Export some example cards for testing
export const ExampleCards = {
  wolf: createAnimalCard('wolf', 'Loup')
    .addCell(0, 0, ['water'])
    .addCell(0, 1, ['water'])
    .addCell(1, 0, ['mountain', 'mountain'])
    .withDescription('Un prédateur solitaire des rivières et montagnes')
    .build(),

  rabbit: createQuickCard('rabbit', 'Lapin', 'horizontalLine', ['field', 'brown', 'field']),

  eagle: createQuickCard('eagle', 'Aigle', 'cross', 'mountain', 'water'),

  beaver: createAnimalCard('beaver', 'Castor')
    .addCell(0, 0, ['water'])
    .addCell(-1, 1, ['water'])
    .addCell(1, -1, ['brown', 'tree'])
    .addCell(1, 0, ['brown'])
    .withDescription('Architecte des cours d\'eau')
    .build()
};


