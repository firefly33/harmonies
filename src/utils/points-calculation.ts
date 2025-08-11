import type {Token, TokenType} from './can-be-placed';
import {findConnectedGroups} from "./GridBuilder.ts";

export interface HexCoord {
  q: number;
  r: number;
}

export interface PixelCoord {
  x: number;
  y: number;
}

export interface GridCell {
  coord: HexCoord;
  pixel: PixelCoord;
  tokens: Token[];
  terrain: 'plain';
}

const HEX_DIRECTIONS: [number, number][] = [
  [1, 0],   // Est (droite)
  [1, -1],  // Nord-Est
  [0, -1],  // Nord-Ouest
  [-1, 0],  // Ouest (gauche)
  [-1, 1],  // Sud-Ouest
  [0, 1]    // Sud-Est
];

export const calculatePoints = (grid: Map<string, GridCell>): number => {
  return calculateWaterPath(grid) + calculateMountainPaths(grid) + calculateFieldPaths(grid);
};

export const calculateMountainPaths  = (grid: Map<string, GridCell>): number => {
  const mountainCells = Array.from(grid.values()).filter(
      cell => cell.tokens.some((t: Token) => t.type === 'mountain')
  );

  if (mountainCells.length === 0) return 0;

  console.log(`⚪️ Moutain cells ${mountainCells.map(w => `${w.coord.q},${w.coord.r}`).join(" ; ")}`)

  const tokenType = 'mountain' as TokenType;
  const groupsOfAtLeastTwoTokens = findConnectedGroups(grid, tokenType).filter(g => g.length > 1);
  if (groupsOfAtLeastTwoTokens.length <= 0) {
    return 0;
  }

  let count = 0;
  groupsOfAtLeastTwoTokens.forEach((group) => {
    const singleMountainChained = group.filter(g => g.tokens.length === 1 && g.tokens.some(t => t.type === 'mountain'));
    const twoMountainChained = group.filter(g => g.tokens.length === 2 && g.tokens.some(t => t.type === 'mountain'));
    const threeMountainChained = group.filter(g => g.tokens.length === 3 && g.tokens.some(t => t.type === 'mountain'));

    if (singleMountainChained && singleMountainChained.length > 0) {
      count += singleMountainChained.length
    }

    if (twoMountainChained && twoMountainChained.length > 0) {
      count += twoMountainChained.length * 3
    }

    if (threeMountainChained && threeMountainChained.length > 0) {
      count += threeMountainChained.length * 7
    }
  })

  return count;
}

export const calculateFieldPaths = (grid: Map<string, GridCell>): number => {
  const fieldCells = Array.from(grid.values()).filter(
      cell => cell.tokens.some((t: Token) => t.type === 'field')
  );

  if (fieldCells.length === 0) return 0;

  console.log(`🟡 Field cells ${fieldCells.map(w => `${w.coord.q},${w.coord.r}`).join(" ; ")}`)


  const tokenType = 'field' as TokenType;
  const groups = findConnectedGroups(grid, tokenType);
  if (groups.length <= 0) {
    return 0;
  }

  const groupsBySizeAndGreaterToTwo = groups
    .filter(g => g.length >= 2);

  return groupsBySizeAndGreaterToTwo.length * 5;
}


export const calculateWaterPath = (grid: Map<string, GridCell>) => {
  const waterCells = Array.from(grid.values()).filter(
      cell => cell.tokens.some((t: Token) => t.type === 'water')
  );

  if (waterCells.length === 0) return 0;

  console.log(`🔵 Water cells ${waterCells.map(w => `${w.coord.q},${w.coord.r}`).join(" ; ")}`)

  const tokenType = 'water' as TokenType;
  const groups = findConnectedGroups(grid, tokenType);
  if (groups.length <= 0) {
    return 0;
  }

  const groupsBySize = groups.sort((a, b) => b.length - a.length)
  const longestGroup = groupsBySize[0];

  switch (longestGroup.length) {
    case 1:
      return 0;
      case 2:
        return 2;
    case 3:
      return 5;
    case 4:
      return 8;
    case 5:
      return 11;
    case 6:
      return 15;
      default: {
        if (longestGroup.length > 6) {
          return 15 + ((longestGroup.length - 6) * 4);
        } else {
          return 0;
        }
      }
  }
}
