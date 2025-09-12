import type {Card as CardType} from '../types/Card';
import { getPlacementTokenType } from '../types/Card';
import CardCanvas from './CardCanvas';

interface CardProps {
  card: CardType;
  width?: number;
  height?: number;
  hexSize?: number;
  onClick?: (card: CardType) => void;
  className?: string;
}

const Card = ({
  card,
  width = 240,
  height = 320,
  hexSize = 18,
  onClick,
  className = ""
}: CardProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick(card);
    }
  };

  const canvasHeight = Math.floor(height * 0.6); // 60% for canvas
  const infoHeight = height - canvasHeight; // 40% for info

  // Get the placement token type and its color
  const placementTokenType = getPlacementTokenType(card);
  const getTokenColor = (type: string): string => {
    const colors: Record<string, string> = {
      tree: '#50C878',
      house: '#E74C3C',
      water: '#4A90E2',
      mountain: '#8E8E93',
      field: '#F4D03F',
      brown: '#8B4513'
    };
    return colors[type] || '#8E8E93';
  };
  
  const borderColor = placementTokenType ? getTokenColor(placementTokenType) : '#8E8E93';

  return (
    <div
      className={`bg-white rounded-lg shadow-lg border-2 border-gray-300 overflow-hidden cursor-pointer hover:shadow-xl transition-shadow ${className}`}
      style={{ 
        width, 
        height,
        borderRightColor: borderColor,
        borderRightWidth: '6px'
      }}
      onClick={handleClick}
    >
      {/* Canvas area for pattern visualization */}
      <div
        className="flex items-center justify-center bg-gray-50"
        style={{ height: canvasHeight }}
      >
        <CardCanvas
          pattern={card.pattern}
          width={width - 20}
          height={canvasHeight - 10}
          hexSize={hexSize}
        />
      </div>

      {/* Information area */}
      <div
        className="p-4 flex flex-col justify-center"
        style={{ height: infoHeight }}
      >
        <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
          {card.animalName}
        </h3>

        {card.description && (
          <p className="text-sm text-gray-600 text-center line-clamp-2">
            {card.description}
          </p>
        )}

        {/* Usage indicator squares */}
        <div className="flex justify-center gap-1 mt-2">
          {Array.from({ length: card.maxUsage }, (_, index) => (
            <div
              key={index}
              className={`w-3 h-3 border border-gray-400 ${
                index < (card.currentUsage || 0) 
                  ? 'bg-gray-700' 
                  : 'bg-white'
              }`}
              title={`Usage ${index + 1}/${card.maxUsage}`}
            />
          ))}
        </div>

        {/* Pattern stats */}
        <div className="flex justify-center gap-2 mt-2 text-sm text-gray-500">
          <span>
            {card.pattern.cells.length} cells
          </span>
          <span>•</span>
          <span>
            {card.pattern.cells.reduce((total, cell) => total + cell.tokens.length, 0)} tokens
          </span>
        </div>

        {/* Placement information */}
        {(() => {
          const placementTokenType = getPlacementTokenType(card);
          if (placementTokenType) {
            const tokenEmojis = {
              water: '🌊',
              field: '🌻', 
              mountain: '⛰️',
              tree: '🌳',
              house: '🏠',
              brown: '🟤'
            };
            return (
              <div className="text-sm text-center mt-1 text-blue-600 font-medium">
                🐾 → {tokenEmojis[placementTokenType]} {placementTokenType}
              </div>
            );
          }
          return null;
        })()}
      </div>
    </div>
  );
};

export default Card;
