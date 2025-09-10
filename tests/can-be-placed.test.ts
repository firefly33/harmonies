import { describe, it, expect } from 'vitest';
import {canPlaceAnimal, canPlaceAnimalAtPosition, canPlaceToken, Token} from '../src/utils/can-be-placed';
import {createGridBuilder} from "../src/utils/GridBuilder";
import {createAnimalCard} from "../src/utils/CardPatternBuilder";
import { Card } from '../src/types/Card';
import { GridCell } from '../src/utils/points-calculation';

const createToken = (type: Token['type'], id = '1'): Token => ({
  id,
  type,
  color: '#000000'
});

describe('canPlaceToken', () => {
  describe('General rules', () => {
    it('should allow any token on empty ground', () => {
      const tokens: Token[] = ['tree', 'house', 'water', 'mountain', 'field', 'brown']
      .map(type => createToken(type as Token['type']));

      tokens.forEach(token => {
        expect(canPlaceToken(token, [])).toBe(true);
      });
    });

    it('should prevent stacking more than 3 tokens', () => {
      const existingTokens = [
        createToken('brown', '1'),
        createToken('brown', '2'),
        createToken('brown', '3')
      ];
      const newToken = createToken('mountain');

      expect(canPlaceToken(newToken, existingTokens)).toBe(false);
    });
  });

  describe('Mountain stacking rules', () => {
    it('should allow mountain only on mountain', () => {
      const tokenTypes: Token['type'][] = ['tree', 'house', 'water', 'field', 'brown'];

      tokenTypes.forEach(type => {
        const existingTokens = [createToken(type)];
        const mountain = createToken('mountain');
        expect(canPlaceToken(mountain, existingTokens)).toBe(false);
      });
    });

    it('should allow mountain stacking up to 3 total', () => {
      const oneToken = [createToken('mountain')];
      const twoTokens = [createToken('mountain'), createToken('mountain')];
      const threeTokens = [createToken('mountain'), createToken('mountain'), createToken('mountain')];

      expect(canPlaceToken(createToken('mountain'), oneToken)).toBe(true);
      expect(canPlaceToken(createToken('mountain'), twoTokens)).toBe(true);
      expect(canPlaceToken(createToken('mountain'), threeTokens)).toBe(false);
    });
  });

  describe('Tree stacking rules', () => {
    it('should allow tree on 1 brown token', () => {
      const existingTokens = [createToken('brown')];
      const tree = createToken('tree');

      expect(canPlaceToken(tree, existingTokens)).toBe(true);
    });

    it('should allow tree on 2 brown tokens', () => {
      const existingTokens = [createToken('brown'), createToken('brown')];
      const tree = createToken('tree');

      expect(canPlaceToken(tree, existingTokens)).toBe(true);
    });

    it('should not allow tree on non-brown tokens', () => {
      const nonBrownTypes: Token['type'][] = ['tree', 'house', 'water', 'mountain', 'field'];

      nonBrownTypes.forEach(type => {
        const existingTokens = [createToken(type)];
        const tree = createToken('tree');
        expect(canPlaceToken(tree, existingTokens)).toBe(false);
      });
    });

    it('should not allow tree on mixed token stacks', () => {
      const mixedStack = [createToken('brown'), createToken('mountain')];
      const tree = createToken('tree');

      expect(canPlaceToken(tree, mixedStack)).toBe(false);
    });

    it('should not allow tree on more than 2 brown tokens', () => {
      const threeBrownTokens = [createToken('brown'), createToken('brown'), createToken('brown')];
      const tree = createToken('tree');

      expect(canPlaceToken(tree, threeBrownTokens)).toBe(false);
    });
  });

  describe('Field stacking rules', () => {
    it('should only allow field at ground level', () => {
      const field = createToken('field');

      expect(canPlaceToken(field, [])).toBe(true);
      expect(canPlaceToken(field, [createToken('brown')])).toBe(false);
      expect(canPlaceToken(field, [createToken('mountain')])).toBe(false);
    });
  });

  describe('Water stacking rules', () => {
    it('should only allow water at ground level', () => {
      const water = createToken('water');

      expect(canPlaceToken(water, [])).toBe(true);
      expect(canPlaceToken(water, [createToken('brown')])).toBe(false);
      expect(canPlaceToken(water, [createToken('mountain')])).toBe(false);
    });
  });

  describe('House (building) stacking rules', () => {
    it('should allow house at ground level', () => {
      const house = createToken('house');

      expect(canPlaceToken(house, [])).toBe(true);
    });

    it('should not allow house at third level', () => {
      const house = createToken('house');
      const twoMountains = [createToken('mountain'), createToken('mountain')];

      expect(canPlaceToken(house, twoMountains)).toBe(false);
    });

    it('should allow house on brown tokens', () => {
      const house = createToken('house');
      const oneBrown = [createToken('brown')];

      expect(canPlaceToken(house, oneBrown)).toBe(true);
    });

    it('should allow house on mountain tokens', () => {
      const house = createToken('house');
      const oneMountain = [createToken('mountain')];

      expect(canPlaceToken(house, oneMountain)).toBe(true);
    });

    it('should allow house on other houses', () => {
      const house = createToken('house');
      const oneHouse = [createToken('house')];

      expect(canPlaceToken(house, oneHouse)).toBe(true);
    });

    it('should not allow house on invalid base tokens', () => {
      const house = createToken('house');
      const invalidBases: Token['type'][] = ['tree', 'water', 'field'];

      invalidBases.forEach(type => {
        const existingTokens = [createToken(type)];
        expect(canPlaceToken(house, existingTokens)).toBe(false);
      });
    });

    it('should not allow house when stack would exceed 3', () => {
      const house = createToken('house');
      const threeTokenStack = [createToken('brown'), createToken('house'), createToken('house')];

      expect(canPlaceToken(house, threeTokenStack)).toBe(false);
    });
  });

  describe('Brown token stacking rules', () => {
    it('should allow brown tokens anywhere up to 3 stacks', () => {
      const brown = createToken('brown');

      expect(canPlaceToken(brown, [])).toBe(true);
      expect(canPlaceToken(brown, [createToken('mountain')])).toBe(false);
      expect(canPlaceToken(brown, [createToken('brown')])).toBe(true);
      expect(canPlaceToken(brown, [createToken('brown'), createToken('tree')])).toBe(false);
      expect(canPlaceToken(brown, [createToken('brown'), createToken('brown'), createToken('brown')])).toBe(false);
    });

    it('should allow brown only on brown', () => {
      const tokenTypes: Token['type'][] = ['tree', 'house', 'water', 'field', 'mountain'];

      tokenTypes.forEach(type => {
        const existingTokens = [createToken(type)];
        const mountain = createToken('brown');
        expect(canPlaceToken(mountain, existingTokens)).toBe(false);
      });
    });
  });

  describe('Complex stacking scenarios', () => {
    it('should validate realistic game scenarios', () => {
      // Valid: Brown -> Brown -> Tree
      const brownBrownStack = [createToken('brown'), createToken('brown')];
      expect(canPlaceToken(createToken('tree'), brownBrownStack)).toBe(true);

      // Invalid: Brown -> Tree -> House (can't place house on tree)
      const brownTreeStack = [createToken('brown'), createToken('tree')];
      expect(canPlaceToken(createToken('house'), brownTreeStack)).toBe(false);

      // Invalid: Mountain -> Mountain -> House
      const mountainMountainStack = [createToken('mountain'), createToken('mountain')];
      expect(canPlaceToken(createToken('house'), mountainMountainStack)).toBe(false);

      // Invalid: Brown -> House -> House
      const brownHouseStack = [createToken('brown'), createToken('house')];
      expect(canPlaceToken(createToken('house'), brownHouseStack)).toBe(false);

      // Valid: Mountain -> Mountain -> House
      const mountainStack = [createToken('mountain')];
      expect(canPlaceToken(createToken('house'), mountainStack)).toBe(true);

      // Valid: Brown -> House -> House
      const houseStack = [createToken('house')];
      expect(canPlaceToken(createToken('house'), houseStack)).toBe(true);
    });

    it.each([
      {token: createToken('tree'), stack: [createToken('brown'), createToken('brown')], canTokenBePlaced: true},
      {token: createToken('house'), stack: [createToken('brown'), createToken('tree')], canTokenBePlaced: false},
      {token: createToken('house'), stack: [createToken('mountain')], canTokenBePlaced: true},
      {token: createToken('house'), stack: [createToken('brown')], canTokenBePlaced: true},
    ])('can place token $token.type', ({token, stack, canTokenBePlaced}) => {
      expect(canPlaceToken(token, stack)).toBe(canTokenBePlaced);
    })
  });

  describe("Animal placing rules", () => {
    describe("for the Racoon", () => {
      const RACOON_CARD = createAnimalCard('1', 'Raton-laveur')
      .addCell(0, 0, ['field'])     // This is where the animal will be placed
      .addCell(0, 1, ['water'])
      .addCell(1, 0, ['water'])
      .addCell(-1, 1, ['water'])
      .withPlacementCell(0, 0)      // Animal placed on the field token
      .withMaxUsage(2)              // Can be used 2 times
      .withDescription('Un voleur de poubelles')
      .build();

      it("should allow placing for same position", () => {
        const grid = createGridBuilder()
        .placeField(0, 0)
        .placeWater(0, 1)
        .placeWater(-1, 1)
        .placeWater(1, 0)
        .build();

        expect(canPlaceAnimal(RACOON_CARD, grid)).toBe(true);
      });

      it("should allow placing in different directions", () => {
        const grid = createGridBuilder()
        .placeField(0, 0)
        .placeWater(-1, 0)
        .placeWater(-1, 1)
        .placeWater(0, -1)
        .build();

        expect(canPlaceAnimal(RACOON_CARD, grid)).toBe(true);
      });

      describe("should allow all 6 rotational orientations", () => {
        // Original pattern: field at (0,0), water at (0,1), (1,0), (-1,1)
        
        it("0° rotation (original)", () => {
          const grid = createGridBuilder()
          .placeField(0, 0)
          .placeWater(0, 1)    // above
          .placeWater(1, 0)    // right
          .placeWater(-1, 1)   // upper-left
          .build();
          
          expect(canPlaceAnimal(RACOON_CARD, grid)).toBe(true);
        });

        it("60° rotation", () => {
          const grid = createGridBuilder()
          .placeField(0, 0)
          .placeWater(-1, 0)   // left  
          .placeWater(-1, 1)   // upper-left
          .placeWater(0, -1)   // lower-right
          .build();
          
          expect(canPlaceAnimal(RACOON_CARD, grid)).toBe(true);
        });

        it("120° rotation", () => {
          const grid = createGridBuilder()
          .placeField(0, 0)
          .placeWater(1, -1)   // (0,1) rotated 120° → (1,-1)
          .placeWater(0, -1)   // (1,0) rotated 120° → (0,-1)  
          .placeWater(1, 0)    // (-1,1) rotated 120° → (1,0)
          .build();
          
          expect(canPlaceAnimal(RACOON_CARD, grid)).toBe(true);
        });

        it("180° rotation", () => {
          const grid = createGridBuilder()
          .placeField(0, 0)
          .placeWater(0, -1)   // below
          .placeWater(-1, 0)   // left
          .placeWater(1, -1)   // lower-right
          .build();
          
          expect(canPlaceAnimal(RACOON_CARD, grid)).toBe(true);
        });

        it("240° rotation", () => {
          const grid = createGridBuilder()
          .placeField(0, 0)
          .placeWater(1, 0)    // right
          .placeWater(1, -1)   // lower-right
          .placeWater(0, 1)    // upper-left
          .build();
          
          expect(canPlaceAnimal(RACOON_CARD, grid)).toBe(true);
        });

        it("300° rotation", () => {
          const grid = createGridBuilder()
          .placeField(0, 0)
          .placeWater(-1, 1)   // (0,1) rotated 300° → (-1,1)
          .placeWater(0, 1)    // (1,0) rotated 300° → (0,1)
          .placeWater(-1, 0)   // (-1,1) rotated 300° → (-1,0)
          .build();
          
          expect(canPlaceAnimal(RACOON_CARD, grid)).toBe(true);
        });
      });

      describe("should reject invalid placements", () => {
        it("should reject when placement cell has wrong token type", () => {
          const grid = createGridBuilder()
          .placeWater(0, 0)    // water instead of field!
          .placeWater(0, 1)
          .placeWater(1, 0)
          .placeWater(-1, 1)
          .build();
          
          expect(canPlaceAnimal(RACOON_CARD, grid)).toBe(false);
        });

        it("should reject when missing water tokens", () => {
          const grid = createGridBuilder()
          .placeField(0, 0)
          .placeWater(0, 1)
          .placeWater(1, 0)
          // Missing water at (-1, 1)
          .build();
          
          expect(canPlaceAnimal(RACOON_CARD, grid)).toBe(false);
        });

        it("should accept when extra tokens present elsewhere", () => {
          // The function currently only checks if the pattern can be matched
          // Extra tokens elsewhere on the grid should be allowed
          const grid = createGridBuilder()
          .placeField(0, 0)
          .placeWater(0, 1)
          .placeWater(1, 0)
          .placeWater(-1, 1)
          .placeTree(1, 1)     // Extra token not in pattern - should be fine
          .build();
          
          expect(canPlaceAnimal(RACOON_CARD, grid)).toBe(true);
        });

        it("should reject when wrong token types in pattern positions", () => {
          const grid = createGridBuilder()
          .placeField(0, 0)
          .placeField(0, 1)    // field instead of water
          .placeWater(1, 0)
          .placeWater(-1, 1)
          .build();
          
          expect(canPlaceAnimal(RACOON_CARD, grid)).toBe(false);
        });

        it("should reject when grid cells don't exist", () => {
          // Empty grid - no cells at required positions
          const grid = createGridBuilder().build();
          
          expect(canPlaceAnimal(RACOON_CARD, grid)).toBe(false);
        });

        it("should reject when token stacks have wrong height", () => {
          const grid = createGridBuilder()
          .placeField(0, 0)
          .placeBrown(0, 1)
          .placeWater(0, 1)    // 2 tokens instead of 1
          .placeWater(1, 0)
          .placeWater(-1, 1)
          .build();
          
          expect(canPlaceAnimal(RACOON_CARD, grid)).toBe(false);
        });
      });

      describe("canPlaceAnimalAtPosition for UI interaction", () => {
        it("should allow placing at different positions on the grid", () => {
          // Test placing racoon at position (0,0) with correct relative pattern  
          // Pattern: field at (0,0), water at (0,1), (1,0), (-1,1)
          const grid = createGridBuilder()
          .placeField(0, 0)     // Placement cell at clicked position
          .placeWater(0, 1)     // Pattern (0,1) relative to (0,0) = (0,1)
          .placeWater(1, 0)     // Pattern (1,0) relative to (0,0) = (1,0)
          .placeWater(-1, 1)    // Pattern (-1,1) relative to (0,0) = (-1,1)
          .build();

          expect(canPlaceAnimalAtPosition(RACOON_CARD, grid, { q: 0, r: 0 })).toBe(true);
        });

        it("should allow placing at negative coordinates", () => {
          // Test placing racoon at position (-1,-1) with correct relative pattern
          const grid = createGridBuilder()
          .placeField(-1, -1)   // Placement cell at clicked position
          .placeWater(-1, 0)    // Pattern (0,1) relative to (-1,-1) = (-1,0)
          .placeWater(0, -1)    // Pattern (1,0) relative to (-1,-1) = (0,-1)
          .placeWater(-2, 0)    // Pattern (-1,1) relative to (-1,-1) = (-2,0)
          .build();

          expect(canPlaceAnimalAtPosition(RACOON_CARD, grid, { q: -1, r: -1 })).toBe(true);
        });

        it("should reject placement when pattern doesn't match at position", () => {
          // Test placing racoon at position (0,0) but without correct tokens
          const grid = createGridBuilder()
          .placeWater(0, 0)     // Wrong token type at placement cell
          .placeWater(0, 1)
          .placeWater(1, 0)
          .placeWater(-1, 1)
          .build();

          expect(canPlaceAnimalAtPosition(RACOON_CARD, grid, { q: 0, r: 0 })).toBe(false);
        });

        it("should work with rotated patterns", () => {
          // Test with 60° rotated pattern
          const grid = createGridBuilder()
          .placeField(0, 0)     // Placement cell
          .placeWater(-1, 0)    // 60° rotation positions
          .placeWater(-1, 1)
          .placeWater(0, -1)
          .build();

          expect(canPlaceAnimalAtPosition(RACOON_CARD, grid, { q: 0, r: 0 })).toBe(true);
        });
      });

    });
  })
});


