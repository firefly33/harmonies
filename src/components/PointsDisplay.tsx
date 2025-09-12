import { usePointsStore } from '../stores/pointsStore';

interface PointsDisplayProps {
  className?: string;
}

const PointsDisplay = ({ className = '' }: PointsDisplayProps) => {
  const { totalPoints, cardPoints, tokenPoints } = usePointsStore();

  return (
    <div className={`bg-amber-100 border-2 border-amber-400 rounded-lg p-4 ${className}`}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-amber-800 mb-2">Points</h3>
        <div className="text-sm font-medium text-amber-700 mb-1">
          Cartes: {cardPoints} | Jetons: {tokenPoints}
        </div>
        <div className="text-3xl font-bold text-amber-700">{totalPoints}</div>
      </div>
    </div>
  );
};

export default PointsDisplay;