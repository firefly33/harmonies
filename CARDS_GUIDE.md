# 🐾 Animal Cards Guide

This guide shows you how to easily create and modify animal card patterns in the Harmonies game.

## 📁 File Structure

- `src/types/Card.ts` - Card interfaces and types
- `src/components/Card.tsx` - Visual card component  
- `src/components/CardCanvas.tsx` - Small hexagonal grid renderer
- `src/utils/CardPatternBuilder.ts` - Easy pattern creation tools
- `src/board/cards-deck/CardsDeck.tsx` - Main cards collection

## 🎨 How to Create New Animal Cards

### Method 1: Builder Pattern (Recommended for complex cards)

```typescript
const wolf = createAnimalCard('wolf', 'Loup')
  .addCell(0, 0, ['water'])           // Center: water token
  .addCell(0, 1, ['water'])           // Above center: water token  
  .addCell(1, 0, ['mountain', 'mountain']) // Right: 2 stacked mountain tokens
  .withPlacementCell(1, 0)            // 🐾 Animal placed on the stacked mountains
  .withDescription('Un prédateur solitaire qui aime les rivières et montagnes')
  .build();
```

### Method 2: Quick Templates (For simple patterns)

```typescript
// Horizontal line of tokens
const rabbit = createQuickCard('rabbit', 'Lapin', 'horizontalLine', ['field', 'brown', 'field']);

// Cross pattern 
const eagle = createQuickCard('eagle', 'Aigle', 'cross', 'mountain', 'water');

// Triangle pattern
const snake = createQuickCard('snake', 'Serpent', 'triangle', 'brown', 'field');
```

### Method 3: Direct Pattern Creation (Maximum flexibility)

```typescript
const fox = {
  id: 'fox',
  animalName: 'Renard',
  description: 'Rusé habitant des villages et forêts',
  pattern: createCardPattern([
    { q: 0, r: 0, tokenTypes: ['house'] },      // Animal placed here
    { q: 1, r: -1, tokenTypes: ['brown', 'tree'] },
    { q: -1, r: 1, tokenTypes: ['field'] }
  ], { q: 0, r: 0 })  // 🐾 Specify placement cell coordinates
};
```

## 🗺️ Understanding Coordinates

Cards use hexagonal coordinates (q, r):
- `q`: Column (-2 to +2)  
- `r`: Row (-3 to +3)
- `(0, 0)`: Center position

```
    (-1,-1)  (0,-1)
(-1, 0)  (0, 0)  (1,-1) 
    (0, 1)   (1, 0)
```

## 🎯 Token Types

Available token types for patterns:
- `'water'` - Blue water tokens 🌊
- `'field'` - Yellow field tokens 🌻  
- `'mountain'` - Gray mountain tokens ⛰️
- `'tree'` - Green tree tokens 🌳
- `'house'` - Red building tokens 🏠
- `'brown'` - Brown foundation tokens 🌱

## 📐 Available Templates

```typescript
PatternTemplates.singleToken('water')           // Single hex with water
PatternTemplates.horizontalLine(['field', 'brown', 'tree']) // 3-hex line  
PatternTemplates.verticalLine(['water', 'water', 'mountain']) // Vertical line
PatternTemplates.triangle('house', 'field')     // Triangle: house center, field corners
PatternTemplates.cross('mountain', 'water')     // Cross: mountain center, water arms
PatternTemplates.lShape(['field', 'brown', 'tree']) // L-shaped pattern
```

## 🔧 Quick Changes

### To add a new animal to the game:

1. Open `src/board/cards-deck/CardsDeck.tsx`
2. Add your card to the `cards` array:

```typescript
const cards: CardType[] = [
  // ... existing cards ...
  
  // Add your new animal here:
  createAnimalCard('tiger', 'Tigre')
    .addCell(0, 0, ['brown', 'brown', 'tree'])
    .addCell(-1, 0, ['water'])
    .addCell(1, 0, ['mountain'])
    .withDescription('Félin majestueux des forêts denses')
    .build()
];
```

### To modify an existing pattern:

Simply change the coordinates and token types:

```typescript
// Before: Wolf with water river
createAnimalCard('wolf', 'Loup')
  .addCell(0, 0, ['water'])
  .addCell(0, 1, ['water'])

// After: Wolf with mountain terrain  
createAnimalCard('wolf', 'Loup')
  .addCell(0, 0, ['mountain'])
  .addCell(0, 1, ['mountain'])
  .addCell(-1, 0, ['mountain'])
```

## 🐾 Animal Placement System

### Visual Indicators:
- **🟡 Highlighted cell** - Light yellow/beige background for placement cell
- **🧡 Orange border** - Thicker orange border around placement cell  
- **🐾 Paw print icon** - Shows above the placement cell
- **Token display** - Shows `🐾 → 🌻 field` below card name

### How it works:
1. Each card specifies exactly which cell the animal will be placed on
2. The system identifies what token type is at that position  
3. Visual feedback shows players where animals go
4. Easy to change placement by updating coordinates

## 🎨 Visual Customization

The cards automatically:
- ✅ Render hexagonal grids with proper spacing
- ✅ Show token stacking with visual offsets  
- ✅ Display stack counts for multiple tokens
- ✅ Use consistent colors for each token type
- ✅ **Highlight animal placement cells** 🐾
- ✅ **Show placement token type** with emojis
- ✅ Scale to fit the card size
- ✅ Show animal name and description

## 🧪 Testing Your Cards

After adding new cards, test the display:

1. Run `npm run dev`
2. Check the cards appear correctly at the bottom of the game board
3. Click cards to test interaction (logs to console)
4. Verify patterns render as expected

That's it! You can now easily create any animal card pattern you want! 🎉