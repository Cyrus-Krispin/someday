const { generateWorld, getSpawnPositions, TERRAIN } = require('../services/worldGen');

describe('World Generation', () => {
  const SEED = 'test_seed_123';

  describe('generateWorld', () => {
    it('should generate a 30x30 world (900 tiles)', () => {
      const world = generateWorld(SEED);
      expect(world).toHaveLength(900); // 30x30
    });

    it('should generate deterministic output for same seed', () => {
      const world1 = generateWorld(SEED);
      const world2 = generateWorld(SEED);
      expect(world1).toEqual(world2);
    });

    it('should generate different output for different seeds', () => {
      const world1 = generateWorld(SEED);
      const world2 = generateWorld('different_seed');
      // At least some tiles should differ
      const differences = world1.filter((tile, i) => tile.terrainType !== world2[i].terrainType);
      expect(differences.length).toBeGreaterThan(0);
    });

    it('should have valid terrain types', () => {
      const world = generateWorld(SEED);
      const validTerrains = Object.values(TERRAIN).map(t => t.type);

      world.forEach(tile => {
        expect(validTerrains).toContain(tile.terrainType);
      });
    });

    it('should assign resources based on terrain', () => {
      const world = generateWorld(SEED);

      world.forEach(tile => {
        const terrain = Object.values(TERRAIN).find(t => t.type === tile.terrainType);
        if (terrain) {
          expect(tile.resourceType).toBe(terrain.resource);
          expect(tile.resourceQuantity).toBeGreaterThanOrEqual(0);
        }
      });
    });

    it('should have tiles with valid coordinates (0-29)', () => {
      const world = generateWorld(SEED);

      world.forEach(tile => {
        expect(tile.x).toBeGreaterThanOrEqual(0);
        expect(tile.x).toBeLessThan(30);
        expect(tile.y).toBeGreaterThanOrEqual(0);
        expect(tile.y).toBeLessThan(30);
      });
    });

    it('should place pre-built locations (mine, farm, market, town_hall)', () => {
      const world = generateWorld(SEED);
      const structures = world.filter(tile => tile.structureType);

      expect(structures.length).toBeGreaterThanOrEqual(5); // At least 5 structures (2 mine, 2 farm, 1 market, 1 town_hall)

      const structureTypes = structures.map(s => s.structureType);
      expect(structureTypes).toContain('mine');
      expect(structureTypes).toContain('farm');
      expect(structureTypes).toContain('market');
      expect(structureTypes).toContain('town_hall');
    });

    it('should not place structures on water tiles', () => {
      const world = generateWorld(SEED);
      const structures = world.filter(tile => tile.structureType);

      structures.forEach(structure => {
        expect(structure.terrainType).not.toBe('water');
      });
    });
  });

  describe('getSpawnPositions', () => {
    it('should return correct number of spawn positions', () => {
      const positions = getSpawnPositions(3, SEED);
      expect(positions).toHaveLength(3);
    });

    it('should return deterministic positions for same seed', () => {
      const pos1 = getSpawnPositions(3, SEED);
      const pos2 = getSpawnPositions(3, SEED);
      expect(pos1).toEqual(pos2);
    });

    it('should return positions within map bounds', () => {
      const positions = getSpawnPositions(3, SEED);

      positions.forEach(pos => {
        expect(pos.x).toBeGreaterThanOrEqual(0);
        expect(pos.x).toBeLessThan(30);
        expect(pos.y).toBeGreaterThanOrEqual(0);
        expect(pos.y).toBeLessThan(30);
      });
    });

    it('should distribute players across the map', () => {
      const positions = getSpawnPositions(3, SEED);

      // Check that positions are not all in the same area
      const xSpread = Math.max(...positions.map(p => p.x)) - Math.min(...positions.map(p => p.x));
      const ySpread = Math.max(...positions.map(p => p.y)) - Math.min(...positions.map(p => p.y));

      expect(xSpread).toBeGreaterThan(5); // Some spread across map
      expect(ySpread).toBeGreaterThan(5);
    });
  });

  describe('TERRAIN constants', () => {
    it('should have correct move costs', () => {
      expect(TERRAIN.GRASSLAND.moveCost).toBe(1);
      expect(TERRAIN.FOREST.moveCost).toBe(2);
      expect(TERRAIN.MOUNTAIN.moveCost).toBe(3);
      expect(TERRAIN.DESERT.moveCost).toBe(2);
      expect(TERRAIN.WATER.moveCost).toBeNull(); // Impassable
    });

    it('should have correct resource types', () => {
      expect(TERRAIN.GRASSLAND.resource).toBe('crops');
      expect(TERRAIN.FOREST.resource).toBe('lumber');
      expect(TERRAIN.MOUNTAIN.resource).toBe('ore');
      expect(TERRAIN.DESERT.resource).toBe('rare_gems');
      expect(TERRAIN.WATER.resource).toBe('fish');
    });
  });
});
