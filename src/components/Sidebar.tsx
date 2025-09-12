import { type ReactNode } from 'react';
import PointsDisplay from './PointsDisplay';
import { calculatePoints, type GridCell } from '../utils/points-calculation';
import { usePointsStore } from '../stores/pointsStore';
import { useCardStatesStore } from '../stores/cardStatesStore';
import { type Card } from '../types/Card';

interface SidebarProps {
  children: ReactNode;
  grid?: Map<string, GridCell>;
  cards?: Card[];
}

const Sidebar = ({ children, grid, cards }: SidebarProps) => {
  const { awardPointsSeparately, resetPoints } = usePointsStore();
  const { getCardUsage } = useCardStatesStore();

  const handleCalculatePoints = () => {
    if (!grid || !cards) return;
    
    // Reset points to zero first
    resetPoints();
    
    // Calculate grid points (token points)
    const tokenPoints = calculatePoints(grid);
    
    // Calculate card points based on usage
    let cardPoints = 0;
    cards.forEach(card => {
      const usage = getCardUsage(card.id);
      for (let i = 0; i < usage; i++) {
        const pointsForUsage = card.pointsPerUsage[i] || 0;
        cardPoints += pointsForUsage;
      }
    });
    
    // Award points separately
    awardPointsSeparately(cardPoints, tokenPoints);
    console.log(`Reset points and awarded ${cardPoints + tokenPoints} total points (${tokenPoints} token + ${cardPoints} cards)`);
  };
  return (
    <aside
      role="complementary"
      className="w-80 bg-white border-l border-gray-200 shadow-lg"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Cartes</h2>
        </div>
        
        {/* Points Display */}
        <div className="p-4 border-b border-gray-200">
          <PointsDisplay />
        </div>
        
        {/* Calculate Points Button */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={handleCalculatePoints}
            disabled={!grid || !cards}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Calculer Points Totaux
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;