
// Grille de base d'Harmonies (23 cases)
import type {GridCell, HexCoord} from "./points-calculation.ts";
import type {Token} from "./can-be-placed.ts";
import {hexToPixel} from "./grid-utils.ts";

const HARMONIES_LAYOUT: HexCoord[] = [
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

// Factory pour créer des tokens rapidement
const TokenFactory = {
  tree: (id: string = 'tree'): Token => ({
    id, type: 'tree', color: '#228B22'
  }),
  house: (id: string = 'house'): Token => ({
    id, type: 'house', color: '#CD853F'
  }),
  water: (id: string = 'water'): Token => ({
    id, type: 'water', color: '#4682B4'
  }),
  mountain: (id: string = 'mountain'): Token => ({
    id, type: 'mountain', color: '#708090'
  }),
  field: (id: string = 'field'): Token => ({
    id, type: 'field', color: '#DAA520'
  }),
  brown: (id: string = 'brown'): Token => ({
    id, type: 'brown', color: '#8B4513'
  })
};

// Builder principal
class GridBuilder {
  private grid: Map<string, GridCell>;

  constructor() {
    this.grid = new Map();
    this.initializeEmptyGrid();
  }

  // Initialiser avec la grille vide d'Harmonies
  private initializeEmptyGrid(): GridBuilder {
    HARMONIES_LAYOUT.forEach(coord => {
      const key = `${coord.q},${coord.r}`;
      this.grid.set(key, {
        coord,
        pixel: { x: 0, y: 0 }, // Peut être calculé plus tard
        tokens: [],
        terrain: 'plain'
      });
    });
    return this;
  }

  // Placer un token à une position
  placeToken(q: number, r: number, token: Token): GridBuilder {
    const key = `${q},${r}`;
    const cell = this.grid.get(key);

    if (cell) {
      const pixel = hexToPixel(cell.coord.q, cell.coord.r);

      cell.tokens.push(token);
      this.grid.set(key, { ...cell, pixel });
    } else {
      console.warn(`Position (${q},${r}) n'existe pas dans la grille`);
    }

    return this;
  }

  // Placer plusieurs tokens en une fois
  placeTokens(placements: Array<{ q: number; r: number; token: Token }>): GridBuilder {
    placements.forEach(({ q, r, token }) => {
      this.placeToken(q, r, token);
    });
    return this;
  }

  // Méthodes de convenance pour types de tokens
  placeWater(q: number, r: number, id?: string): GridBuilder {
    return this.placeToken(q, r, TokenFactory.water(id));
  }

  placeTree(q: number, r: number, id?: string): GridBuilder {
    return this.placeToken(q, r, TokenFactory.tree(id));
  }

  placeMountain(q: number, r: number, id?: string): GridBuilder {
    return this.placeToken(q, r, TokenFactory.mountain(id));
  }

  placeField(q: number, r: number, id?: string): GridBuilder {
    return this.placeToken(q, r, TokenFactory.field(id));
  }

  placeHouse(q: number, r: number, id?: string): GridBuilder {
    return this.placeToken(q, r, TokenFactory.house(id));
  }

  placeBrown(q: number, r: number, id?: string): GridBuilder {
    return this.placeToken(q, r, TokenFactory.brown(id));
  }

  // Créer des patterns prédéfinis
  createWaterRiver(): GridBuilder {
    // Rivière horizontale au centre
    return this
    .placeWater(0, 0)
    .placeWater(1, 0)
    .placeWater(2, 0);
  }

  createMountainCluster(): GridBuilder {
    // Cluster de montagnes
    return this
    .placeMountain(-1, 0)
    .placeMountain(0, 0)
    .placeMountain(0, -1);
  }

  createFieldGroup(): GridBuilder {
    // Groupe de champs connectés
    return this
    .placeField(-2, 1)
    .placeField(-2, 2)
    .placeField(-1, 1)
    .placeField(-1, 2);
  }

  createForestWithBases(): GridBuilder {
    // Arbres avec bases marron
    return this
    .placeBrown(0, 0)
    .placeTree(0, 0) // Stack sur la base
    .placeBrown(1, 0)
    .placeTree(1, 0);
  }

  // Patterns de test spécifiques
  createLongWaterChain(): GridBuilder {
    // Chaîne d'eau en zigzag
    return this
    .placeWater(-2, 0)
    .placeWater(-1, 0)
    .placeWater(0, 0)
    .placeWater(0, -1)
    .placeWater(1, -1);
  }

  createIsolatedWaterPools(): GridBuilder {
    // Plusieurs petites mares isolées
    return this
    .placeWater(-2, 1)
    .placeWater(-2, 2)
    .placeWater(2, -1)
    .placeWater(2, 0);
  }

  createMixedPattern(): GridBuilder {
    // Pattern complexe pour tests complets
    return this
    .placeWater(0, 0)
    .placeWater(1, 0)
    .placeMountain(-1, 0)
    .placeMountain(-1, 1)
    .placeField(0, 1)
    .placeField(1, 1)
    .placeTree(0, -1)
    .placeHouse(2, 0);
  }

  // Remplir aléatoirement
  fillRandomly(density: number = 0.5): GridBuilder {
    const tokenTypes = ['water', 'tree', 'mountain', 'field', 'house'] as const;

    HARMONIES_LAYOUT.forEach(coord => {
      if (Math.random() < density) {
        const randomType = tokenTypes[Math.floor(Math.random() * tokenTypes.length)];
        const token = TokenFactory[randomType](`random_${coord.q}_${coord.r}`);
        this.placeToken(coord.q, coord.r, token);
      }
    });

    return this;
  }

  // Nettoyer la grille
  clear(): GridBuilder {
    this.grid.forEach((cell, key) => {
      this.grid.set(key, { ...cell, tokens: [] });
    });
    return this;
  }

  // Supprimer un token
  removeToken(q: number, r: number): GridBuilder {
    const key = `${q},${r}`;
    const cell = this.grid.get(key);

    if (cell) {
      this.grid.set(key, { ...cell, tokens: [] });
    }

    return this;
  }

  // Obtenir la grille finale
  build(): Map<string, GridCell> {
    return new Map(this.grid);
  }

// Obtenir les statistiques de la grille
  getStats(): {
    totalCells: number;
    filledCells: number;
    totalTokens: number;
    tokenCounts: Record<string, number>;
    stackedCells: number;
    maxStackHeight: number;
    averageStackHeight: number;
  } {
    const cellsWithTokens = Array.from(this.grid.values()).filter(cell => cell.tokens.length > 0);
    const allTokens = cellsWithTokens.flatMap(cell => cell.tokens);

    const tokenCounts: Record<string, number> = {};
    allTokens.forEach(token => {
      tokenCounts[token.type] = (tokenCounts[token.type] || 0) + 1;
    });

    const stackHeights = cellsWithTokens.map(cell => cell.tokens.length);
    const stackedCells = cellsWithTokens.filter(cell => cell.tokens.length > 1).length;
    const maxStackHeight = stackHeights.length > 0 ? Math.max(...stackHeights) : 0;
    const averageStackHeight = stackHeights.length > 0
        ? stackHeights.reduce((sum, height) => sum + height, 0) / stackHeights.length
        : 0;

    return {
      totalCells: this.grid.size,
      filledCells: cellsWithTokens.length,
      totalTokens: allTokens.length,
      tokenCounts,
      stackedCells,
      maxStackHeight,
      averageStackHeight: Math.round(averageStackHeight * 100) / 100
    };
  }

  // Debug : afficher la grille en console
  debug(): GridBuilder {
    console.log('=== GRID DEBUG ===');
    console.log('Stats:', this.getStats());
    console.log('\n=== CELL DETAILS ===');

    HARMONIES_LAYOUT.forEach(coord => {
      const cell = this.grid.get(`${coord.q},${coord.r}`);
      if (!cell) return;

      if (cell.tokens.length === 0) {
        console.log(`(${coord.q},${coord.r}): empty`);
      } else if (cell.tokens.length === 1) {
        console.log(`(${coord.q},${coord.r}): ${cell.tokens[0].type}`);
      } else {
        // Afficher la pile du bas vers le haut
        const stack = cell.tokens.map(t => t.type).join(' → ');
        console.log(`(${coord.q},${coord.r}): [${stack}] (height: ${cell.tokens.length})`);
      }
    });

    // Afficher les groupes connectés par type
    console.log('\n=== CONNECTED GROUPS ===');
    const tokenTypes = ['water', 'tree', 'mountain', 'field', 'house'] as const;

    tokenTypes.forEach(tokenType => {
      const groups = findConnectedGroups(this.grid, tokenType);
      if (groups.length > 0) {
        console.log(`${tokenType === 'water' ? `🔵${tokenType}` : tokenType}: ${groups.length} group(s)`);
        groups.forEach((group, index) => {
          const coords = group.map(cell => `(${cell.coord.q},${cell.coord.r})`).join(', ');
          console.log(`  Group ${index + 1}: ${group.length} cells - ${coords}`);
        });
      }
    });

    return this;
  }
}

// Factory method pour créer un builder
export function createGridBuilder(): GridBuilder {
  return new GridBuilder();
}

// Exemples d'utilisation pour vos tests

// Test 1: Grille vide
export const emptyGrid = createGridBuilder().build();

// Test 2: Rivière simple
export const simpleRiver = createGridBuilder()
.createWaterRiver()
.build();

// Test 3: Pattern complexe
export const complexPattern = createGridBuilder()
.createMixedPattern()
.build();

// Test 4: Grille pleine aléatoire
export const randomGrid = createGridBuilder()
.fillRandomly(0.8)
.build();

// Test 5: Tests de chaînes d'eau
export const longWaterChain = createGridBuilder()
.createLongWaterChain()
.build();

export const isolatedWaterPools = createGridBuilder()
.createIsolatedWaterPools()
.build();

// Test 6: Cas spécifiques pour le scoring
export const mountainClusterTest = createGridBuilder()
.placeMountain(0, 0)
.placeMountain(1, 0)
.placeMountain(0, 1)
.placeMountain(-1, 0) // Isolée
.build();

export const fieldGroupTest = createGridBuilder()
.placeField(0, 0)
.placeField(1, 0)
.placeField(0, 1)
.placeField(2, 0) // Groupe séparé
.placeField(2, 1)
.build();





// Méthode utilitaire pour trouver les groupes connectés
export function findConnectedGroups(grid: Map<string, GridCell>, tokenType: string): GridCell[][] {
  const visited = new Set<string>();
  const groups: GridCell[][] = [];

  HARMONIES_LAYOUT.forEach(coord => {
    const key = `${coord.q},${coord.r}`;
    if (visited.has(key)) return;

    const cell = grid.get(key);
    if (!cell || !hasTokenType(cell, tokenType)) return;

    // Trouver le groupe connecté depuis cette cellule
    const group = exploreConnectedGroup(grid, coord, tokenType, new Set());

    if (group.length > 0) {
      groups.push(group);
      // Marquer toutes les cellules du groupe comme visitées
      group.forEach(groupCell => {
        visited.add(`${groupCell.coord.q},${groupCell.coord.r}`);
      });
    }
  });

  return groups;
}

// Méthode utilitaire pour explorer un groupe connecté
export function exploreConnectedGroup(
    grid: Map<string, GridCell>,
    coord: HexCoord,
    tokenType: string,
    visited: Set<string>
): GridCell[] {
  const key = `${coord.q},${coord.r}`;

  if (visited.has(key)) return [];

  const cell = grid.get(key);
  if (!cell || !hasTokenType(cell, tokenType)) return [];

  visited.add(key);
  const result = [cell];

  // Explorer les voisins
  const neighbors = getNeighborCoords(coord.q, coord.r);
  neighbors.forEach(neighborCoord => {
    const neighborGroup = exploreConnectedGroup(grid, neighborCoord, tokenType, visited);
    result.push(...neighborGroup);
  });

  return result;
}

// Obtenir les coordonnées des voisins
export function getNeighborCoords(q: number, r: number): HexCoord[] {
  const directions = [
    [1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]
  ];

  return directions.map(([dq, dr]) => ({ q: q + dq, r: r + dr }));
}

// Vérifier si une cellule contient un type de token (cherche dans toute la pile)
export function hasTokenType(cell: GridCell, tokenType: string): boolean {
  return cell.tokens.some(token => token.type === tokenType);
}
