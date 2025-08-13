import type {HexCoord} from "../utils/points-calculation.ts";
import type {Token, TokenType} from "../utils/can-be-placed.ts";

export interface CardCell {
  coord: HexCoord;
  tokens: Token[];
}

export interface CardPattern {
  // Relative coordinates from center (0,0) - can be negative
  cells: CardCell[];
  // Bounding box for rendering calculations
  bounds: {
    minQ: number;
    maxQ: number;
    minR: number;
    maxR: number;
  };
}

export interface Card {
  id: string;
  animalName: string;
  pattern: CardPattern;
  // Optional: animal image, description, etc.
  image?: string;
  description?: string;
}

// Helper function to create a card pattern easily
export const createCardPattern = (cellDefinitions: Array<{ q: number; r: number; tokenTypes: TokenType[] }>): CardPattern => {
  const cells: CardCell[] = cellDefinitions.map(({ q, r, tokenTypes }) => ({
    coord: { q, r },
    tokens: tokenTypes.map((type, index) => ({
      id: `${q}-${r}-${index}`,
      type,
      color: getTokenColor(type)
    }))
  }));

  // Calculate bounding box
  const qValues = cells.map(cell => cell.coord.q);
  const rValues = cells.map(cell => cell.coord.r);

  return {
    cells,
    bounds: {
      minQ: Math.min(...qValues),
      maxQ: Math.max(...qValues),
      minR: Math.min(...rValues),
      maxR: Math.max(...rValues)
    }
  };
};

// Helper to get consistent token colors
const getTokenColor = (type: TokenType): string => {
  const colors = {
    tree: '#50C878',
    house: '#E74C3C',
    water: '#4A90E2',
    mountain: '#8E8E93',
    field: '#F4D03F',
    brown: '#8B4513'
  };
  return colors[type];
};
