import { describe, it, expect } from 'vitest';
import { getStructurePositions, generateViewportTiles, getSpawnPositions, TERRAIN, WORLD_SIZE } from '../services/worldGen.js';

describe('World Generation', () => {
  const SEED = 'test_seed_123';

  describe('getStructurePositions', () => {
    it('should generate deterministic structure positions', () => {
      const structures1 = getStructurePositions(SEED);
      const structures2 = getStructurePositions(SEED);
      expect(structures1).toEqual(structures2);
    });

    it('should place pre-built locations (mine, farm, market, town_hall)', () => {
      const structures = getStructurePositions(SEED);

      expect(structures.length).toBeGreaterThanOrEqual(8); // 4 mine, 4 farm, 2 market, 1 town_hall = 11

      const types = structures.map(s => s.structureType);
      expect(types).toContain('mine');
      expect(types).toContain('farm');
      expect(types).toContain('market');
      expect(types).toContain('town_hall');
    });

    it('should place structures within world bounds', () => {
      const structures = getStructurePositions(SEED);

      structures.forEach((s: any) => {
        expect(s.x).toBeGreaterThanOrEqual(0);
        expect(s.x).toBeLessThan(WORLD_SIZE);
        expect(s.y).toBeGreaterThanOrEqual(0);
        expect(s.y).toBeLessThan(WORLD_SIZE);
      });
    });

    it('should generate different positions for different seeds', () => {
      const s1 = getStructurePositions(SEED);
      const s2 = getStructurePositions('different_seed');
      const sameCount = s1.filter((a: any, i: number) => a.x === s2[i]?.x && a.y === s2[i]?.y).length;
      expect(sameCount).toBeLessThan(s1.length); // At least some differ
    });
  });

  describe('generateViewportTiles', () => {
    it('should generate tiles for a viewport region', () => {
      const tiles = generateViewportTiles(SEED, 0, 0, 14, 14, [], WORLD_SIZE);
      expect(tiles.length).toBe(225); // 15x15
    });

    it('should generate deterministic tiles for same seed', () => {
      const tiles1 = generateViewportTiles(SEED, 0, 0, 14, 14, [], WORLD_SIZE);
      const tiles2 = generateViewportTiles(SEED, 0, 0, 14, 14, [], WORLD_SIZE);
      expect(tiles1).toEqual(tiles2);
    });

    it('should have valid terrain types', () => {
      const tiles = generateViewportTiles(SEED, 500, 500, 514, 514, [], WORLD_SIZE);
      const validTerrains = Object.values(TERRAIN).map((t: any) => t.type);

      tiles.forEach((tile: any) => {
        expect(validTerrains).toContain(tile.terrain_type);
      });
    });

    it('should clamp viewport to world bounds', () => {
      const tiles = generateViewportTiles(SEED, -5, -5, 10, 10, [], WORLD_SIZE);
      tiles.forEach((tile: any) => {
        expect(tile.x).toBeGreaterThanOrEqual(0);
        expect(tile.y).toBeGreaterThanOrEqual(0);
        expect(tile.x).toBeLessThanOrEqual(10);
        expect(tile.y).toBeLessThanOrEqual(10);
      });
    });

    it('should merge tile state overlay data', () => {
      const tileStates = [
        { x: 500, y: 500, resource_type: 'ore', resource_quantity: 2, structure_type: 'mine', owner_id: null },
      ];
      const tiles = generateViewportTiles(SEED, 498, 498, 502, 502, tileStates, WORLD_SIZE);
      const tile = tiles.find(t => t.x === 500 && t.y === 500);
      expect(tile).toBeDefined();
      expect(tile!.resource_type).toBe('ore');
      expect(tile!.resource_quantity).toBe(2);
      expect(tile!.structure_type).toBe('mine');
    });

    it('should assign resources based on terrain when no state exists', () => {
      const tiles = generateViewportTiles(SEED, 500, 500, 514, 514, [], WORLD_SIZE);
      tiles.forEach((tile: any) => {
        expect(tile.resource_type).toBeTruthy();
        expect(tile.resource_quantity).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('getSpawnPositions', () => {
    it('should return correct number of spawn positions', () => {
      const positions = getSpawnPositions(3, SEED, WORLD_SIZE);
      expect(positions).toHaveLength(3);
    });

    it('should return deterministic positions for same seed', () => {
      const pos1 = getSpawnPositions(3, SEED, WORLD_SIZE);
      const pos2 = getSpawnPositions(3, SEED, WORLD_SIZE);
      expect(pos1).toEqual(pos2);
    });

    it('should return positions within map bounds', () => {
      const positions = getSpawnPositions(3, SEED, WORLD_SIZE);

      positions.forEach((pos: any) => {
        expect(pos.x).toBeGreaterThanOrEqual(0);
        expect(pos.x).toBeLessThan(WORLD_SIZE);
        expect(pos.y).toBeGreaterThanOrEqual(0);
        expect(pos.y).toBeLessThan(WORLD_SIZE);
      });
    });

    it('should distribute players across the map', () => {
      const positions = getSpawnPositions(3, SEED, WORLD_SIZE);

      const xSpread = Math.max(...positions.map((p: any) => p.x)) - Math.min(...positions.map((p: any) => p.x));
      const ySpread = Math.max(...positions.map((p: any) => p.y)) - Math.min(...positions.map((p: any) => p.y));

      expect(xSpread).toBeGreaterThan(50); // Much larger world — expect more spread
      expect(ySpread).toBeGreaterThan(50);
    });
  });

  describe('TERRAIN constants', () => {
    it('should have correct move costs', () => {
      expect(TERRAIN.GRASSLAND.moveCost).toBe(1);
      expect(TERRAIN.FOREST.moveCost).toBe(2);
      expect(TERRAIN.MOUNTAIN.moveCost).toBe(3);
      expect(TERRAIN.DESERT.moveCost).toBe(2);
      expect(TERRAIN.WATER.moveCost).toBeNull();
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
