import type {Card} from "../types/Card.ts";
import type {GridCell, HexCoord} from "./points-calculation.ts";

export type TokenType = 'tree' | 'house' | 'water' | 'mountain' | 'field' | 'brown' | 'animal';

export interface Token {
  id: string;
  type: TokenType;
  color: string;
}

export const canPlaceToken = (newToken: Token, existingTokens: Token[]): boolean => {
  if (existingTokens.length >= 3) {
    return false;
  }

  if (existingTokens.length === 0) {
    return true;
  }

  const topToken = existingTokens[existingTokens.length - 1];

  switch (newToken.type) {
    case 'mountain':
      return topToken.type === 'mountain' && existingTokens.length < 3;

    case 'tree': {
      const brownCount = existingTokens.filter(t => t.type === 'brown').length;
      return brownCount === existingTokens.length && existingTokens.length <= 2;
    }

    case 'field':
      return existingTokens.length === 0;

    case 'water':
      return existingTokens.length === 0;

    case 'house':
      return ['brown', 'mountain', 'house'].includes(topToken.type) && existingTokens.length < 2;

    case 'brown':
      return !['mountain', 'house', 'water', 'field', 'tree'].includes(topToken.type) && existingTokens.length < 3;

    case 'animal':
      return true; // Animals can be placed on any token (they go on top)

    default:
      return false;
  }
};


// Rotate hexagonal coordinates around origin (0,0)
// rotation: 0-5 for 60-degree increments (0 = no rotation, 1 = 60° CCW, etc.)
const rotateHex = (q: number, r: number, rotation: number): { q: number, r: number } => {
  let currentQ = q;
  let currentR = r;
  let currentS = -q - r;
  
  for (let i = 0; i < (rotation % 6); i++) {
    // 60-degree counterclockwise rotation: (q,r,s) -> (-s,-q,-r)
    const newQ = -currentS;
    const newR = -currentQ;
    const newS = -currentR;
    currentQ = newQ;
    currentR = newR;
    currentS = newS;
  }
  
  return { q: currentQ, r: currentR };
};

// Check if pattern matches grid at any rotation (0-5, representing 0° to 300° in 60° steps)
const canPlaceAnimalAtRotation = (animalCard: Card, grid: Map<string, GridCell>, rotation: number): boolean => {
  const placementCell = animalCard.pattern.placementCell;
  
  for (const patternCell of animalCard.pattern.cells) {
    // Calculate relative position from placement cell
    const relativeQ = patternCell.coord.q - placementCell.q;
    const relativeR = patternCell.coord.r - placementCell.r;
    
    // Rotate the relative position
    const rotated = rotateHex(relativeQ, relativeR, rotation);
    
    // Calculate final grid position (rotated relative + placement cell)
    const finalQ = rotated.q + placementCell.q;
    const finalR = rotated.r + placementCell.r;
    const gridKey = `${finalQ},${finalR}`;
    
    // Get the grid cell at this position
    const gridCell = grid.get(gridKey);
    if (!gridCell) {
      return false; // Grid cell doesn't exist
    }
    
    // Check if the required tokens match exactly with what's on the board
    const requiredTokens = patternCell.tokens;
    const existingTokens = gridCell.tokens;
    
    // Must have the same number of tokens
    if (requiredTokens.length !== existingTokens.length) {
      return false;
    }
    
    // Each token type must match in the same order
    for (let i = 0; i < requiredTokens.length; i++) {
      if (requiredTokens[i].type !== existingTokens[i].type) {
        return false;
      }
    }
  }
  
  return true;
};

export function canPlaceAnimal(animalCard: Card, grid: Map<string, GridCell>): boolean {
  // Try all 6 possible rotations (0°, 60°, 120°, 180°, 240°, 300°)
  for (let rotation = 0; rotation < 6; rotation++) {
    if (canPlaceAnimalAtRotation(animalCard, grid, rotation)) {
      return true;
    }
  }
  
  return false;
}

// Check if animal can be placed at a specific anchor position (for UI interaction)
export function canPlaceAnimalAtPosition(animalCard: Card, grid: Map<string, GridCell>, anchorCoord: HexCoord): boolean {
  const placementCell = animalCard.pattern.placementCell;
  
  // Try all 6 possible rotations
  for (let rotation = 0; rotation < 6; rotation++) {
    let canPlace = true;
    
    // Check if all pattern cells can be placed at this rotation and position
    for (const patternCell of animalCard.pattern.cells) {
      // Calculate relative position from placement cell
      const relativeQ = patternCell.coord.q - placementCell.q;
      const relativeR = patternCell.coord.r - placementCell.r;
      
      // Rotate the relative position
      const rotated = rotateHex(relativeQ, relativeR, rotation);
      
      // Calculate final grid position (rotated relative + anchor)
      const finalQ = rotated.q + anchorCoord.q;
      const finalR = rotated.r + anchorCoord.r;
      const gridKey = `${finalQ},${finalR}`;
      
      // Get the grid cell at this position
      const gridCell = grid.get(gridKey);
      if (!gridCell) {
        canPlace = false;
        break;
      }
      
      // Check if the required tokens match exactly with what's on the board
      const requiredTokens = patternCell.tokens;
      const existingTokens = gridCell.tokens;
      
      // Must have the same number of tokens
      if (requiredTokens.length !== existingTokens.length) {
        canPlace = false;
        break;
      }
      
      // Each token type must match in the same order
      for (let i = 0; i < requiredTokens.length; i++) {
        if (requiredTokens[i].type !== existingTokens[i].type) {
          canPlace = false;
          break;
        }
      }
      
      if (!canPlace) break;
    }
    
    if (canPlace) {
      return true;
    }
  }
  
  return false;
}
