import type {GridCell, HexCoord, PixelCoord} from "./points-calculation";
import type {Token, TokenType} from "./can-be-placed.ts";

const HEX_SIZE = 50;
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 600;
const GRID_CENTER_X = CANVAS_WIDTH / 2;
const GRID_CENTER_Y = CANVAS_HEIGHT / 2;

// Grille hexagonale d'Harmonies - 23 cases (5-4-5-4-5 par colonne)
export const GRID_LAYOUT: HexCoord[] = [
  // Colonne 1 (5 cases) - q = -2
  { q: -2, r: -1 }, { q: -2, r: 0 }, { q: -2, r: 1 }, { q: -2, r: 2 }, { q: -2, r: 3 },
  // Colonne 2 (4 cases) - q = -1
  { q: -1, r: -1 }, { q: -1, r: 0 }, { q: -1, r: 1 }, { q: -1, r: 2 },
  // Colonne 3 (5 cases) - q = 0 (centre)
  { q: 0, r: -2 }, { q: 0, r: -1 }, { q: 0, r: 0 }, { q: 0, r: 1 }, { q: 0, r: 2 },
  // Colonne 4 (4 cases) - q = 1
  { q: 1, r: -2 }, { q: 1, r: -1 }, { q: 1, r: 0 }, { q: 1, r: 1 },
  // Colonne 5 (5 cases) - q = 2
  { q: 2, r: -3 }, { q: 2, r: -2 }, { q: 2, r: -1 }, { q: 2, r: 0 }, { q: 2, r: 1 }
];

// Utilitaires hexagonaux
export const hexToPixel = (q: number, r: number): PixelCoord => {
  const x = HEX_SIZE * (3/2 * q);
  const y = HEX_SIZE * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r);
  return {
    x: x + GRID_CENTER_X,
    y: y + GRID_CENTER_Y
  };
};

export const createToken = (type: Token['type'], id = '1'): Token => ({
  id,
  type,
  color: '#000000'
});

export const createEmptyGrid = (): Map<string, GridCell> => {
  const grid = new Map<string, GridCell>();

  GRID_LAYOUT.forEach((coord) => {
    const key = `${coord.q},${coord.r}`;
    const pixel = hexToPixel(coord.q, coord.r);

    grid.set(key, {
      coord,
      pixel,
      tokens: [],
      terrain: 'plain'
    });
  });

  return grid;
};

export const placeAToken = (grid: Map<string, GridCell>, position: string, tokenType: TokenType) => {
  const centerKey = position;
  const centerCell = grid.get(centerKey)!;
  const treeToken = createToken(tokenType);

  const updatedCell: GridCell = {
    ...centerCell,
    tokens: [treeToken]
  };
  grid.set(centerKey, updatedCell);

  return grid;
}
