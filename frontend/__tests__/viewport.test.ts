import { calculateViewport } from '../utils/viewport';

describe('viewport Utils', () => {
  describe('calculateViewport', () => {
    it('should calculate 15x15 viewport around player', () => {
      const playerPos = { x: 15, y: 15 };
      const viewport = calculateViewport(playerPos, 30, 7);

      expect(viewport.xMin).toBe(8);
      expect(viewport.xMax).toBe(22);
      expect(viewport.yMin).toBe(8);
      expect(viewport.yMax).toBe(22);
    });

    it('should handle player near left edge', () => {
      const playerPos = { x: 2, y: 15 };
      const viewport = calculateViewport(playerPos, 30, 7);

      expect(viewport.xMin).toBe(0);
      expect(viewport.xMax).toBe(14);
    });

    it('should handle player near right edge', () => {
      const playerPos = { x: 28, y: 15 };
      const viewport = calculateViewport(playerPos, 30, 7);

      expect(viewport.xMax).toBe(29);
      expect(viewport.xMin).toBe(15);
    });

    it('should handle player near top edge', () => {
      const playerPos = { x: 15, y: 2 };
      const viewport = calculateViewport(playerPos, 30, 7);

      expect(viewport.yMin).toBe(0);
      expect(viewport.yMax).toBe(14);
    });

    it('should handle player near bottom edge', () => {
      const playerPos = { x: 15, y: 28 };
      const viewport = calculateViewport(playerPos, 30, 7);

      expect(viewport.yMax).toBe(29);
      expect(viewport.yMin).toBe(15);
    });
  });
});
