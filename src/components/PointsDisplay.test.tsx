import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import PointsDisplay from './PointsDisplay';
import { usePointsStore } from '../stores/pointsStore';

describe('PointsDisplay', () => {
  beforeEach(() => {
    // Reset the store before each test
    usePointsStore.getState().resetPoints();
  });

  it('should display zero points initially', () => {
    render(<PointsDisplay />);

    expect(screen.getByText('Points')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should display updated points from store', () => {
    const { awardAnimalCardPoints } = usePointsStore.getState();

    // Mock a card with points
    const mockCard = {
      id: 'test',
      animalName: 'Test',
      pointsPerUsage: [15],
      pattern: { cells: [], bounds: { minQ: 0, maxQ: 0, minR: 0, maxR: 0 }, placementCell: { q: 0, r: 0 } },
      maxUsage: 1,
      currentUsage: 0
    };

    awardAnimalCardPoints(mockCard, 0);

    render(<PointsDisplay />);

    expect(screen.getByText('Points')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<PointsDisplay className="custom-class" />);

    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv).toHaveClass('custom-class');
  });

  it('should have proper styling classes', () => {
    const { container } = render(<PointsDisplay />);

    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv).toHaveClass('bg-amber-100', 'border-2', 'border-amber-400', 'rounded-lg', 'p-4');

    const title = screen.getByText('Points');
    expect(title).toHaveClass('text-lg', 'font-semibold', 'text-amber-800', 'mb-2');

    const pointsValue = screen.getByText('0');
    expect(pointsValue).toHaveClass('text-3xl', 'font-bold', 'text-amber-700');
  });
});
