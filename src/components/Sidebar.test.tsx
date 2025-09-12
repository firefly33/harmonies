import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';
import { usePointsStore } from '../stores/pointsStore';
import { useCardStatesStore } from '../stores/cardStatesStore';
import { calculatePoints } from '../utils/points-calculation';

// Mock the calculatePoints function
vi.mock('../utils/points-calculation', () => ({
  calculatePoints: vi.fn()
}));

describe('Sidebar', () => {
  beforeEach(() => {
    // Reset the stores before each test
    usePointsStore.getState().resetPoints();
    useCardStatesStore.getState().resetCardUsages();
    vi.clearAllMocks();
  });

  it('should render with content always visible', () => {
    render(
      <Sidebar>
        <div data-testid="sidebar-content">Test Content</div>
      </Sidebar>
    );

    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-content')).toBeVisible();
  });

  it('should render header with title', () => {
    render(
      <Sidebar>
        <div>Test Content</div>
      </Sidebar>
    );

    expect(screen.getByText('Cartes')).toBeVisible();
  });

  it('should render children content', () => {
    render(
      <Sidebar>
        <div data-testid="child-content">Child Content</div>
      </Sidebar>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeVisible();
  });

  it('should have proper styling classes for fixed column layout', () => {
    render(
      <Sidebar>
        <div>Content</div>
      </Sidebar>
    );

    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveClass('w-80', 'bg-white', 'border-l', 'border-gray-200', 'shadow-lg');
  });

  it('should have scrollable content area', () => {
    render(
      <Sidebar>
        <div data-testid="content">Content</div>
      </Sidebar>
    );

    const contentArea = screen.getByTestId('content').parentElement;
    expect(contentArea).toHaveClass('overflow-y-auto');
  });

  it('should render the calculate points button', () => {
    render(
      <Sidebar>
        <div>Test content</div>
      </Sidebar>
    );
    
    expect(screen.getByText('Calculer Points Totaux')).toBeInTheDocument();
  });

  it('should disable button when no grid or cards are provided', () => {
    render(
      <Sidebar>
        <div>Test content</div>
      </Sidebar>
    );
    
    const button = screen.getByText('Calculer Points Totaux');
    expect(button).toBeDisabled();
  });

  it('should enable button when both grid and cards are provided', () => {
    const mockGrid = new Map();
    const mockCards = [{ id: '1', animalName: 'Test', pointsPerUsage: [5], maxUsage: 1 }] as any;
    
    render(
      <Sidebar grid={mockGrid} cards={mockCards}>
        <div>Test content</div>
      </Sidebar>
    );
    
    const button = screen.getByText('Calculer Points Totaux');
    expect(button).not.toBeDisabled();
  });

  it('should reset and calculate total points (grid + cards) when button is clicked', () => {
    const mockGrid = new Map();
    const mockCards = [
      { id: '1', animalName: 'Card1', pointsPerUsage: [3, 8], maxUsage: 2 },
      { id: '2', animalName: 'Card2', pointsPerUsage: [5], maxUsage: 1 }
    ] as any;
    const mockCalculatePoints = vi.mocked(calculatePoints);
    mockCalculatePoints.mockReturnValue(20); // Grid points
    
    // Set some card usage
    useCardStatesStore.getState().incrementCardUsage('1', 2); // First usage: 3 points
    useCardStatesStore.getState().incrementCardUsage('1', 2); // Second usage: 8 points
    useCardStatesStore.getState().incrementCardUsage('2', 1); // First usage: 5 points
    // Total card points: 3 + 8 + 5 = 16 points
    
    // Set some initial points to verify they get reset
    usePointsStore.getState().awardPointsDirectly(100);
    expect(usePointsStore.getState().totalPoints).toBe(100);
    
    render(
      <Sidebar grid={mockGrid} cards={mockCards}>
        <div>Test content</div>
      </Sidebar>
    );
    
    const button = screen.getByText('Calculer Points Totaux');
    fireEvent.click(button);
    
    // Check that calculatePoints was called with the grid
    expect(mockCalculatePoints).toHaveBeenCalledWith(mockGrid);
    
    // Check that points were reset and new total awarded (20 grid + 16 cards = 36)
    expect(usePointsStore.getState().totalPoints).toBe(36);
  });

  it('should reset points to zero when no points to award', () => {
    const mockGrid = new Map();
    const mockCards = [{ id: '1', animalName: 'Card1', pointsPerUsage: [5], maxUsage: 1 }] as any;
    const mockCalculatePoints = vi.mocked(calculatePoints);
    mockCalculatePoints.mockReturnValue(0);
    
    // No card usage, so no card points either
    
    // Set some initial points to verify they get reset
    usePointsStore.getState().awardPointsDirectly(15);
    expect(usePointsStore.getState().totalPoints).toBe(15);
    
    render(
      <Sidebar grid={mockGrid} cards={mockCards}>
        <div>Test content</div>
      </Sidebar>
    );
    
    const button = screen.getByText('Calculer Points Totaux');
    fireEvent.click(button);
    
    // Check that points were reset to zero
    expect(usePointsStore.getState().totalPoints).toBe(0);
  });
});