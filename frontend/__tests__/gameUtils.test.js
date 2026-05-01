import { getTerrainColor } from '../utils/gameUtils';

describe('gameUtils', () => {
  describe('getTerrainColor', () => {
    it('should return correct color for grassland', () => {
      expect(getTerrainColor('grassland')).toBe('#7CFC00');
    });

    it('should return correct color for forest', () => {
      expect(getTerrainColor('forest')).toBe('#228B22');
    });

    it('should return correct color for mountain', () => {
      expect(getTerrainColor('mountain')).toBe('#808080');
    });

    it('should return correct color for desert', () => {
      expect(getTerrainColor('desert')).toBe('#F4A460');
    });

    it('should return correct color for water', () => {
      expect(getTerrainColor('water')).toBe('#1E90FF');
    });

    it('should return white for unknown terrain', () => {
      expect(getTerrainColor('unknown')).toBe('#FFFFFF');
    });
  });
});
