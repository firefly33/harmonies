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
  // The cell where the animal will be placed (coordinates relative to pattern)
  placementCell: HexCoord;
}

export interface Card {
  id: string;
  animalName: string;
  pattern: CardPattern;
  // Optional: animal image, description, etc.
  image?: string;
  description?: string;
  // Usage tracking
  maxUsage: number;        // Total number of times this animal can be used
  currentUsage?: number;   // Current number of times used (default: 0)
}

// Helper function to get the placement token type for a card
export const getPlacementTokenType = (card: Card): TokenType | null => {
  const placementCell = card.pattern.cells.find(
    cell => cell.coord.q === card.pattern.placementCell.q && 
            cell.coord.r === card.pattern.placementCell.r
  );
  
  if (!placementCell || placementCell.tokens.length === 0) {
    return null;
  }
  
  // Return the top token type (last in the stack)
  return placementCell.tokens[placementCell.tokens.length - 1].type;
};

// Helper function to create a card pattern easily
export const createCardPattern = (
  cellDefinitions: Array<{ q: number; r: number; tokenTypes: TokenType[] }>,
  placementCell?: HexCoord
): CardPattern => {
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
  
  // Default placement cell to first cell if not specified
  const defaultPlacementCell = placementCell || cells[0]?.coord || { q: 0, r: 0 };

  return {
    cells,
    bounds: {
      minQ: Math.min(...qValues),
      maxQ: Math.max(...qValues),
      minR: Math.min(...rValues),
      maxR: Math.max(...rValues)
    },
    placementCell: defaultPlacementCell
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
