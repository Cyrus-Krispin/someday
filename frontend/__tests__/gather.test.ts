import { canGather, getGatherYield, canWork, getWorkYield, getResourceValue } from '../utils/gather';

describe('Gather Utils', () => {
  describe('canGather', () => {
    it('should allow gather on tile with resources', () => {
      const tile = { terrainType: 'grassland', resourceType: 'crops', resourceQuantity: 3, structureType: null };
      expect(canGather(tile)).toBe(true);
    });

    it('should reject gather on depleted tile', () => {
      const tile = { terrainType: 'grassland', resourceType: 'crops', resourceQuantity: 0, structureType: null };
      const result = canGather(tile);
      expect(result).toBe(false);
    });

    it('should reject gather on water tile', () => {
      const tile = { terrainType: 'water', resourceType: null, resourceQuantity: 0, structureType: null };
      expect(canGather(tile)).toBe(false);
    });

    it('should allow gather on forest tile with lumber', () => {
      const tile = { terrainType: 'forest', resourceType: 'lumber', resourceQuantity: 5, structureType: null };
      expect(canGather(tile)).toBe(true);
    });

    it('should allow gather on mountain tile with ore', () => {
      const tile = { terrainType: 'mountain', resourceType: 'ore', resourceQuantity: 2, structureType: null };
      expect(canGather(tile)).toBe(true);
    });
  });

  describe('getGatherYield', () => {
    it('should return 1 crop from grassland', () => {
      const tile = { terrainType: 'grassland', resourceType: 'crops', resourceQuantity: 3, structureType: null };
      const result = getGatherYield(tile, null);
      expect(result.resourceType).toBe('crops');
      expect(result.quantity).toBe(1);
    });

    it('should return 1 lumber from forest', () => {
      const tile = { terrainType: 'forest', resourceType: 'lumber', resourceQuantity: 5, structureType: null };
      const result = getGatherYield(tile, null);
      expect(result.resourceType).toBe('lumber');
      expect(result.quantity).toBe(1);
    });

    it('should return half yield during drought on farm tiles', () => {
      const tile = { terrainType: 'grassland', resourceType: 'crops', resourceQuantity: 3, structureType: null };
      const result = getGatherYield(tile, 'drought');
      // Drought halves farm/crop output — rounds down, minimum 0
      expect(result.quantity).toBe(0);
    });

    it('should not affect non-crop resources during drought', () => {
      const tile = { terrainType: 'forest', resourceType: 'lumber', resourceQuantity: 5, structureType: null };
      const result = getGatherYield(tile, 'drought');
      expect(result.quantity).toBe(1); // Drought only affects crops
    });
  });

  describe('canWork', () => {
    it('should allow work at a mine structure', () => {
      const tile = { terrainType: 'mountain', resourceType: 'ore', resourceQuantity: 0, structureType: 'mine' };
      expect(canWork(tile)).toBe(true);
    });

    it('should allow work at a farm structure', () => {
      const tile = { terrainType: 'grassland', resourceType: 'crops', resourceQuantity: 0, structureType: 'farm' };
      expect(canWork(tile)).toBe(true);
    });

    it('should allow work at a market structure', () => {
      const tile = { terrainType: 'grassland', resourceType: null, resourceQuantity: 0, structureType: 'market' };
      expect(canWork(tile)).toBe(true);
    });

    it('should reject work on tile with no structure', () => {
      const tile = { terrainType: 'grassland', resourceType: 'crops', resourceQuantity: 3, structureType: null };
      expect(canWork(tile)).toBe(false);
    });

    it('should reject work on a cabin (passive income only)', () => {
      const tile = { terrainType: 'grassland', resourceType: null, resourceQuantity: 0, structureType: 'cabin' };
      expect(canWork(tile)).toBe(false);
    });
  });

  describe('getWorkYield', () => {
    it('should return 2 ore from mine', () => {
      const result = getWorkYield('mine', null);
      expect(result.resources).toContainEqual({ resourceType: 'ore', quantity: 2 });
    });

    it('should return 3 crops from farm', () => {
      const result = getWorkYield('farm', null);
      expect(result.resources).toContainEqual({ resourceType: 'crops', quantity: 3 });
    });

    it('should triple mine output during token_rush event', () => {
      const result = getWorkYield('mine', 'token_rush');
      expect(result.resources).toContainEqual({ resourceType: 'ore', quantity: 6 }); // 2 * 3
    });

    it('should halve farm output during drought', () => {
      const result = getWorkYield('farm', 'drought');
      expect(result.resources).toContainEqual({ resourceType: 'crops', quantity: 1 }); // floor(3/2)
    });
  });

  describe('getResourceValue', () => {
    it('should return 1 for crops', () => expect(getResourceValue('crops')).toBe(1));
    it('should return 2 for fish', () => expect(getResourceValue('fish')).toBe(2));
    it('should return 2 for lumber', () => expect(getResourceValue('lumber')).toBe(2));
    it('should return 3 for ore', () => expect(getResourceValue('ore')).toBe(3));
    it('should return 10 for gems', () => expect(getResourceValue('gems')).toBe(10));
    it('should return 10 for rare_gems', () => expect(getResourceValue('rare_gems')).toBe(10));
    it('should return 0 for unknown', () => expect(getResourceValue('unknown')).toBe(0));
  });
});
