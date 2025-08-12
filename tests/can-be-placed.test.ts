import { describe, it, expect } from 'vitest';
import { canPlaceToken, Token } from '../src/utils/can-be-placed';

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

    it('should allow house on brown tokens', () => {
      const house = createToken('house');
      const oneBrown = [createToken('brown')];
      const twoBrown = [createToken('brown'), createToken('brown')];

      expect(canPlaceToken(house, oneBrown)).toBe(true);
      expect(canPlaceToken(house, twoBrown)).toBe(true);
    });

    it('should allow house on mountain tokens', () => {
      const house = createToken('house');
      const oneMountain = [createToken('mountain')];
      const twoMountains = [createToken('mountain'), createToken('mountain')];

      expect(canPlaceToken(house, oneMountain)).toBe(true);
      expect(canPlaceToken(house, twoMountains)).toBe(true);
    });

    it('should allow house on other houses', () => {
      const house = createToken('house');
      const oneHouse = [createToken('house')];
      const twoHouses = [createToken('house'), createToken('house')];

      expect(canPlaceToken(house, oneHouse)).toBe(true);
      expect(canPlaceToken(house, twoHouses)).toBe(true);
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

      // Valid: Mountain -> Mountain -> House
      const mountainMountainStack = [createToken('mountain'), createToken('mountain')];
      expect(canPlaceToken(createToken('house'), mountainMountainStack)).toBe(true);

      // Valid: Brown -> House -> House
      const brownHouseStack = [createToken('brown'), createToken('house')];
      expect(canPlaceToken(createToken('house'), brownHouseStack)).toBe(true);
    });

    it.each([
      { token: createToken('tree'), stack: [createToken('brown'), createToken('brown')], canTokenBePlaced: true },
      { token: createToken('house'), stack: [createToken('brown'), createToken('tree')], canTokenBePlaced: false },
      { token: createToken('house'), stack: [createToken('mountain'), createToken('mountain')], canTokenBePlaced: true },
      { token: createToken('house'), stack: [createToken('brown'), createToken('house')], canTokenBePlaced: true },
    ])('can place token $token.type', ({ token, stack, canTokenBePlaced }) => {
      expect(canPlaceToken(token, stack)).toBe(canTokenBePlaced);
    })
  });
});
