import { describe, it, expect, beforeEach } from 'vitest';
import { usePointsStore } from './pointsStore';
import { createAnimalCard } from '../utils/CardPatternBuilder';

describe('pointsStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    usePointsStore.getState().resetPoints();
  });

  it('should start with zero points', () => {
    const { totalPoints } = usePointsStore.getState();
    expect(totalPoints).toBe(0);
  });

  it('should award points for card usage correctly', () => {
    const { awardAnimalCardPoints } = usePointsStore.getState();

    const card = createAnimalCard('test', 'Test Animal')
      .addCell(0, 0, ['field'])
      .withPointsPerUsage([3, 8])
      .build();

    const firstUsagePoints = awardAnimalCardPoints(card, 0);
    expect(firstUsagePoints).toBe(3);

    let { totalPoints } = usePointsStore.getState();
    expect(totalPoints).toBe(3);

    const secondUsagePoints = awardAnimalCardPoints(card, 1);
    expect(secondUsagePoints).toBe(8);

    ({ totalPoints } = usePointsStore.getState());
    expect(totalPoints).toBe(11);
  });

  it('should award points directly', () => {
    const { awardPointsDirectly, totalPoints: initialPoints } = usePointsStore.getState();
    expect(initialPoints).toBe(0);

    awardPointsDirectly(25);

    const { totalPoints } = usePointsStore.getState();
    expect(totalPoints).toBe(25);
  });

  it('should not award negative points directly', () => {
    const { awardPointsDirectly } = usePointsStore.getState();

    // Set some initial points
    awardPointsDirectly(10);
    expect(usePointsStore.getState().totalPoints).toBe(10);

    // Try to award negative points
    awardPointsDirectly(-5);

    // Should remain unchanged
    expect(usePointsStore.getState().totalPoints).toBe(10);
  });

  it('should not award zero points directly', () => {
    const { awardPointsDirectly } = usePointsStore.getState();

    // Set some initial points
    awardPointsDirectly(10);
    expect(usePointsStore.getState().totalPoints).toBe(10);

    // Try to award zero points
    awardPointsDirectly(0);

    // Should remain unchanged
    expect(usePointsStore.getState().totalPoints).toBe(10);
  });

  it('should combine card points and direct points', () => {
    const { awardAnimalCardPoints, awardPointsDirectly } = usePointsStore.getState();

    const card = createAnimalCard('test', 'Test Animal')
      .addCell(0, 0, ['field'])
      .withPointsPerUsage([5])
      .build();

    // Award card points
    awardAnimalCardPoints(card, 0);
    expect(usePointsStore.getState().totalPoints).toBe(5);

    // Award direct points
    awardPointsDirectly(10);
    expect(usePointsStore.getState().totalPoints).toBe(15);
  });

  it('should reset all points', () => {
    const { awardAnimalCardPoints, awardPointsDirectly, resetPoints } = usePointsStore.getState();

    const card = createAnimalCard('test', 'Test Animal')
      .addCell(0, 0, ['field'])
      .withPointsPerUsage([10])
      .build();

    // Award some points
    awardAnimalCardPoints(card, 0);
    awardPointsDirectly(15);
    expect(usePointsStore.getState().totalPoints).toBe(25);

    // Reset
    resetPoints();
    expect(usePointsStore.getState().totalPoints).toBe(0);
  });
});
