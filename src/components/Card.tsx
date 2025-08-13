import type {Card as CardType} from '../types/Card';
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
  width = 180,
  height = 240,
  hexSize = 12,
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

  return (
    <div
      className={`bg-white rounded-lg shadow-lg border-2 border-gray-300 overflow-hidden cursor-pointer hover:shadow-xl transition-shadow ${className}`}
      style={{ width, height }}
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
        className="p-3 flex flex-col justify-center"
        style={{ height: infoHeight }}
      >
        <h3 className="text-lg font-bold text-gray-800 text-center mb-1">
          {card.animalName}
        </h3>

        {card.description && (
          <p className="text-xs text-gray-600 text-center line-clamp-2">
            {card.description}
          </p>
        )}

        {/* Pattern stats */}
        <div className="flex justify-center gap-2 mt-2 text-xs text-gray-500">
          <span>
            {card.pattern.cells.length} cells
          </span>
          <span>•</span>
          <span>
            {card.pattern.cells.reduce((total, cell) => total + cell.tokens.length, 0)} tokens
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;
