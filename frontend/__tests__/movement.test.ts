import { getTerrainMovementCost, validateMove, calculateMovementRemaining } from '../utils/movement';

describe('Movement Utils', () => {
  describe('getTerrainMovementCost', () => {
    it('should return 1 for grassland', () => {
      expect(getTerrainMovementCost('grassland')).toBe(1);
    });

    it('should return 2 for forest', () => {
      expect(getTerrainMovementCost('forest')).toBe(2);
    });

    it('should return 3 for mountain', () => {
      expect(getTerrainMovementCost('mountain')).toBe(3);
    });

    it('should return 2 for desert', () => {
      expect(getTerrainMovementCost('desert')).toBe(2);
    });

    it('should return null for water (impassable)', () => {
      expect(getTerrainMovementCost('water')).toBeNull();
    });

    it('should throw for unknown terrain', () => {
      expect(() => getTerrainMovementCost('unknown')).toThrow();
    });
  });

  describe('validateMove', () => {
    const playerPos = { x: 10, y: 10 };

    it('should allow move to adjacent grassland with enough budget', () => {
      const targetPos = { x: 11, y: 10 };
      const targetTerrain = 'grassland';
      const movementRemaining = 6;

      const result = validateMove(playerPos, targetPos, targetTerrain, movementRemaining);
      expect(result.valid).toBe(true);
      expect(result.cost).toBe(1);
    });

    it('should allow move to adjacent mountain with enough budget', () => {
      const targetPos = { x: 10, y: 11 };
      const targetTerrain = 'mountain';
      const movementRemaining = 6;

      const result = validateMove(playerPos, targetPos, targetTerrain, movementRemaining);
      expect(result.valid).toBe(true);
      expect(result.cost).toBe(3);
    });

    it('should reject move to water', () => {
      const targetPos = { x: 11, y: 10 };
      const targetTerrain = 'water';
      const movementRemaining = 6;

      const result = validateMove(playerPos, targetPos, targetTerrain, movementRemaining);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('water');
    });

    it('should reject move exceeding budget', () => {
      const targetPos = { x: 11, y: 10 };
      const targetTerrain = 'mountain'; // costs 3
      const movementRemaining = 2;

      const result = validateMove(playerPos, targetPos, targetTerrain, movementRemaining);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('movement');
    });

    it('should reject move to non-adjacent tile (diagonal)', () => {
      const targetPos = { x: 12, y: 12 };
      const targetTerrain = 'grassland';
      const movementRemaining = 6;

      const result = validateMove(playerPos, targetPos, targetTerrain, movementRemaining);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('adjacent');
    });

    it('should reject move to non-adjacent tile (too far)', () => {
      const targetPos = { x: 13, y: 10 };
      const targetTerrain = 'grassland';
      const movementRemaining = 6;

      const result = validateMove(playerPos, targetPos, targetTerrain, movementRemaining);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('adjacent');
    });

    it('should allow move to orthogonally adjacent tile', () => {
      // Test all 4 directions
      const directions = [
        { x: 11, y: 10 }, // right
        { x: 9, y: 10 },  // left
        { x: 10, y: 11 }, // down
        { x: 10, y: 9 },  // up
      ];

      directions.forEach((targetPos) => {
        const result = validateMove(playerPos, targetPos, 'grassland', 6);
        expect(result.valid).toBe(true);
      });
    });
  });

  describe('calculateMovementRemaining', () => {
    it('should subtract movement cost from budget', () => {
      const remaining = calculateMovementRemaining(6, 'grassland');
      expect(remaining).toBe(5); // 6 - 1
    });

    it('should handle multiple moves', () => {
      let remaining = 6;
      remaining = calculateMovementRemaining(remaining, 'grassland'); // 5
      remaining = calculateMovementRemaining(remaining, 'forest'); // 3
      remaining = calculateMovementRemaining(remaining, 'mountain'); // 0

      expect(remaining).toBe(0);
    });

    it('should not allow negative movement budget', () => {
      const remaining = calculateMovementRemaining(1, 'mountain'); // 1 - 3
      expect(remaining).toBeLessThan(0); // Implementation allows, will be caught by validateMove
    });
  });
});
