import {describe, it, expect} from 'vitest';
import {createEmptyGrid, createToken, GRID_LAYOUT } from '../src/utils/grid-utils';
import {calculateFieldPaths, calculateForestPaths, calculateHousePaths, calculateMountainPaths, calculatePoints, calculateWaterPath, GridCell} from '../src/utils/points-calculation';
import {createGridBuilder} from "../src/utils/GridBuilder";

describe('Points Calculation', () => {
  describe('Grid instantiation', () => {
    it('should create an empty grid matching the React component structure', () => {
      const grid = createEmptyGrid();

      // Test that grid has the correct number of cells (23 hexagons)
      expect(grid.size).toBe(23);
      expect(grid.size).toBe(GRID_LAYOUT.length);

      // Test that all expected coordinates are present
      GRID_LAYOUT.forEach(coord => {
        const key = `${coord.q},${coord.r}`;
        expect(grid.has(key)).toBe(true);

        const cell = grid.get(key)!;
        expect(cell.coord).toEqual(coord);
        expect(cell.tokens).toEqual([]);
        expect(cell.terrain).toBe('plain');
        expect(cell.pixel).toBeDefined();
        expect(typeof cell.pixel.x).toBe('number');
        expect(typeof cell.pixel.y).toBe('number');
      });
    });

    it('should verify grid layout matches Harmonies pattern (5-4-5-4-5 columns)', () => {
      const grid = createEmptyGrid();

      // Count cells per column (q coordinate)
      const columnCounts = new Map<number, number>();

      Array.from(grid.values()).forEach(cell => {
        const q = cell.coord.q;
        columnCounts.set(q, (columnCounts.get(q) || 0) + 1);
      });

      // Verify the 5-4-5-4-5 pattern
      expect(columnCounts.get(-2)).toBe(5); // Column 1
      expect(columnCounts.get(-1)).toBe(4); // Column 2
      expect(columnCounts.get(0)).toBe(5);  // Column 3 (center)
      expect(columnCounts.get(1)).toBe(4);  // Column 4
      expect(columnCounts.get(2)).toBe(5);  // Column 5
    });

    it('should allow placing tokens on grid cells', () => {
      const grid = createEmptyGrid();

      // Place a tree token at center position (0,0)
      const centerKey = '0,0';
      const centerCell = grid.get(centerKey)!;
      const treeToken = createToken('tree');

      const updatedCell: GridCell = {
        ...centerCell,
        tokens: [treeToken]
      };
      grid.set(centerKey, updatedCell);

      // Verify the token was placed
      const modifiedCell = grid.get(centerKey)!;
      expect(modifiedCell.tokens).toHaveLength(1);
      expect(modifiedCell.tokens[0]).toEqual(treeToken);
    });
  });

  describe('Points calculation', () => {
    it('should return 0 for empty grid', () => {
      const grid = createEmptyGrid();
      const points = calculatePoints(grid);

      expect(points).toBe(0);
    });

    describe("🌊 for rivers", () => {
      it("should return 0 for one token of water", () => {
        const grid = createGridBuilder().build()

        const points = calculatePoints(grid);

        expect(points).toBe(0)
      });

      it("should return 2 for two adjacent tokens of water", () => {
        const grid = createGridBuilder()
        .placeWater(-2, -1)
        .placeWater(-2, 0)
        .build()

        const points = calculateWaterPath(grid);

        expect(points).toBe(2)
      });

      it("should return 5 for three adjacent tokens of water", () => {
        const grid = createGridBuilder()
        .placeWater(-2, -1)
        .placeWater(-2, 0)
        .placeWater(-1, 0)
        .build()

        const points = calculateWaterPath(grid);

        expect(points).toBe(5)
      });

      it("should return 8 for four adjacent tokens of water", () => {
        const grid = createGridBuilder()
        .placeWater(0, -1)
        .placeWater(0, 0)
        .placeWater(0, 1)
        .placeWater(1, 1)
        .build()

        const points = calculateWaterPath(grid);

        expect(points).toBe(8)
      });

      it("should return 11 for five adjacent tokens of water", () => {
        const grid = createGridBuilder()
        .placeWater(1, 0)
        .placeWater(1, -1)
        .placeWater(0, -1)
        .placeWater(0, -2)
        .placeWater(-1, 0)
        .debug()
        .build()

        const points = calculateWaterPath(grid);

        expect(points).toBe(11)
      });

      it("should return 15 for six adjacent tokens of water", () => {
        const grid = createGridBuilder()
        .placeWater(2, 0)
        .placeWater(1, 0)
        .placeWater(1, -1)
        .placeWater(0, -1)
        .placeWater(0, -2)
        .placeWater(-1, 0)
        .debug()
        .build()

        const points = calculateWaterPath(grid);

        expect(points).toBe(15)
      });

      it("should return 15+4 (19) for six and one more adjacent tokens of water", () => {
        const grid = createGridBuilder()
        .placeWater(2, 1)
        .placeWater(2, 0)
        .placeWater(1, 0)
        .placeWater(1, -1)
        .placeWater(0, -1)
        .placeWater(0, -2)
        .placeWater(-1, 0)
        .debug()
        .build()

        const points = calculateWaterPath(grid);

        expect(points).toBe(19)
      });

      it("should return scale over six adjacent tokens of water", () => {
        const grid = createGridBuilder()
        .placeWater(-2, -1)
        .placeWater(-1, -1)
        .placeWater(0, -2)
        .placeWater(1, -2)
        .placeWater(2, -2)
        .placeWater(2, -1)
        .placeWater(2, 0)
        .placeWater(1, 1)
        .placeWater(0, 2)
        .placeWater(-1, 2)
        .placeWater(-2, 2)
        .placeWater(-2, 1)
        .placeWater(-1, 0)
        .debug()
        .build()

        const points = calculateWaterPath(grid);

        expect(points).toBe(43)
      });

      it("should get the points for the longest river", () => {
        const grid = createGridBuilder()
        .placeWater(-2, -1)
        .placeWater(-1, -1)
        .placeWater(0, -2)
        .placeWater(1, -2)
        .placeWater(2, -2)
        .placeWater(2, -1)
        .placeWater(1, 1)
        .placeWater(0, 2)
        .placeWater(-1, 2)
        .placeWater(-2, 2)
        .placeWater(-2, 1)
        .debug()
        .build()

        const points = calculateWaterPath(grid);

        expect(points).toBe(15)
      });
    })

    describe("🌻 for fields", () => {
      it("should return 0 for one token of field", () => {
        const grid = createGridBuilder()
        .placeField(0, 0)
        .build()

        const points = calculateFieldPaths(grid);

        expect(points).toBe(0)
      });

      it("should return 5 for two tokens of field", () => {
        const grid = createGridBuilder()
        .placeField(0, 0)
        .placeField(0, 1)
        .build()

        const points = calculateFieldPaths(grid);

        expect(points).toBe(5)
      });

      it("should return 5 for two tokens of field", () => {
        const grid = createGridBuilder()
        .placeField(0, 0)
        .placeField(0, 1)
        .placeField(0, 2)
        .build()

        const points = calculateFieldPaths(grid);

        expect(points).toBe(5)
      });

      it("should return 10 for four tokens of field", () => {
        const grid = createGridBuilder()
        .placeField(0, 0)
        .placeField(0, 1)
        .placeField(2, 0)
        .placeField(2, 1)
        .build()

        const points = calculateFieldPaths(grid);

        expect(points).toBe(10)
      });

    })

    describe("⛰️ for moutains", () => {
      it("should return 0 for one token of moutains", () => {
        const grid = createGridBuilder()
        .placeMountain(0, 0)
        .build()

        const points = calculateMountainPaths(grid);

        expect(points).toBe(0)
      });

      it("should return 2 for two tokens of moutains", () => {
        const grid = createGridBuilder()
        .placeMountain(0, 0)
        .placeMountain(0, 1)
        .build()

        const points = calculateMountainPaths(grid);

        expect(points).toBe(2)
      });

      it("should return 4 for two tokens of moutains", () => {
        const grid = createGridBuilder()
        .placeMountain(0, 0)
        .placeMountain(0, 0)
        .placeMountain(0, 1)
        .build()

        const points = calculateMountainPaths(grid);

        expect(points).toBe(4)
      });

      it("should return 8 for two tokens of moutains", () => {
        const grid = createGridBuilder()
        .placeMountain(0, 0)
        .placeMountain(0, 0)
        .placeMountain(0, 0)
        .placeMountain(0, 1)
        .debug()
        .build()

        const points = calculateMountainPaths(grid);

        expect(points).toBe(8)
      });

      it("should scale by cases", () => {
        const grid = createGridBuilder()
          .placeMountain(0, 0)
          .placeMountain(0, 0)
          .placeMountain(0, 0)
          .placeMountain(0, 1)
          .placeMountain(-1, -1)
          .placeMountain(-1, -1)
          .placeMountain(-2, -1)
          .placeMountain(0, 1)
          .placeMountain(0, 2)
          .placeMountain(2, 1)
          .placeMountain(2, 1)
          .build()

        const points = calculateMountainPaths(grid);

        expect(points).toBe(15)
      });
    })

    describe("🌊🌻⛰️️ for the above", () => {
      it("should return 31 for a board of mountains, rivers and fields", () => {
        const grid = createGridBuilder()
          .placeMountain(0, 0)
          .placeMountain(0, 0)
          .placeMountain(0, 0)
          .placeMountain(0, 1)
          .placeMountain(-1, -1)
          .placeMountain(-1, -1)
          .placeMountain(2, 1)
          .placeMountain(2, 1)
          .placeMountain(-2, -1)
          .placeMountain(0, 1)
          .placeMountain(0, 2)
          .placeWater(2, -3)
          .placeWater(1, -2)
          .placeWater(0, -1)
          .placeWater(-1, 0)
          .placeWater(-2, 0)
          .placeField(2, -2)
          .placeField(2, -1)
          .build()

        const points = calculatePoints(grid);

        expect(points).toBe(31)
      });
    });

    describe("🌳 for forests", () => {
      it("should return 0 for no token of forest", () => {
        const grid = createGridBuilder()
        .build()

        const points = calculateForestPaths(grid);

        expect(points).toBe(0)
      });

      it("should return 1 for one token of forest", () => {
        const grid = createGridBuilder()
          .placeTree(0, 0)
          .build()

        const points = calculateForestPaths(grid);

        expect(points).toBe(1)
      });

      it("should return 3 for one token of forest over one dirt", () => {
        const grid = createGridBuilder()
        .placeBrown(0, 0)
        .placeTree(0, 0)
        .build()

        const points = calculateForestPaths(grid);

        expect(points).toBe(3)
      });

      it("should return 7 for one token of forest over two dirts", () => {
        const grid = createGridBuilder()
        .placeBrown(0, 0)
        .placeBrown(0, 0)
        .placeTree(0, 0)
        .build()

        const points = calculateForestPaths(grid);

        expect(points).toBe(7)
      });

      it("should return 11 for complex", () => {
        const grid = createGridBuilder()
        .placeBrown(0, 0)
        .placeBrown(0, 0)
        .placeTree(0, 0)
        .placeBrown(1, 1)
        .placeTree(1, 1)
        .placeTree(-1, -1)
        .build()

        const points = calculateForestPaths(grid);

        expect(points).toBe(11)
      });
    })

    describe("🌊🌻⛰️️🌳 for the above", () => {
      it("should return 34 for a board of mountains, rivers and fields", () => {
        const grid = createGridBuilder()
        .placeMountain(0, 0)
        .placeMountain(0, 0)
        .placeMountain(0, 0)
        .placeMountain(0, 1)
        .placeMountain(-1, -1)
        .placeMountain(-1, -1)
        .placeMountain(2, 1)
        .placeMountain(2, 1)
        .placeMountain(-2, -1)
        .placeMountain(0, 1)
        .placeMountain(0, 2)
        .placeWater(2, -3)
        .placeWater(1, -2)
        .placeWater(0, -1)
        .placeWater(-1, 0)
        .placeWater(-2, 0)
        .placeField(2, -2)
        .placeField(2, -1)
        .placeBrown(-1, 2)
        .placeTree(-1, 2)
        .build()

        const points = calculatePoints(grid);

        expect(points).toBe(34)
      });
    });

    describe("🏠 for houses", () => {
      it("should return 0 for nothing around a house", () => {
        const grid = createGridBuilder()
        .placeHouse(0, 0)
        .build()

        const points = calculateHousePaths(grid);

        expect(points).toBe(0)
      });

      it("should return 5 for at least 3 different tokens around a house", () => {
        const grid = createGridBuilder()
        .placeHouse(-2, 1)
        .placeField(-2, 2)
        .placeMountain(-1, 1)
        .placeWater(-1, 0)
        .debug()
        .build()

        const points = calculateHousePaths(grid);

        expect(points).toBe(5)
      });

      it("should return 5 for at least 3 different stacked tokens around a house", () => {
        const grid = createGridBuilder()
        .placeHouse(-2, 1)
        .placeField(-2, 2)
        .placeMountain(-1, 1)
        .placeWater(-1, 0)
        .debug()
        .build()

        const points = calculateHousePaths(grid);

        expect(points).toBe(5)
      });

      it("should return 10 for at least 3 different tokens around two houses", () => {
        const grid = createGridBuilder()
        .placeHouse(-2, 1)
        .placeField(-2, 2)
        .placeMountain(-1, 1)
        .placeWater(-1, 0)
        .placeHouse(0, 0)
        .placeTree(1, -1)
        .debug()
        .build()

        const points = calculateHousePaths(grid);

        expect(points).toBe(10)
      });
    })

    describe("🌊🌻⛰️️🌳🏠 for the above", () => {
      it("should return 39 for a board of mountains, rivers, fields and houses", () => {
        const grid = createGridBuilder()
        .placeMountain(0, 0)
        .placeMountain(0, 0)
        .placeMountain(0, 0)
        .placeMountain(0, 1)
        .placeMountain(-1, -1)
        .placeMountain(-1, -1)
        .placeMountain(2, 1)
        .placeMountain(2, 1)
        .placeMountain(-2, -1)
        .placeMountain(0, 1)
        .placeMountain(0, 2)
        .placeWater(2, -3)
        .placeWater(1, -2)
        .placeWater(0, -1)
        .placeWater(-1, 0)
        .placeWater(-2, 0)
        .placeField(2, -2)
        .placeField(2, -1)
        .placeBrown(-1, 2)
        .placeTree(-1, 2)
        .placeHouse(1, -1)
        .build()

        const points = calculatePoints(grid);

        expect(points).toBe(39)
      });
    });
  });
});
