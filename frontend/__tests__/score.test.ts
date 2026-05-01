import { calculateScore, calculateResourceScore, getLeaderboardRank } from '../utils/score';

describe('Score Utils', () => {
  describe('calculateResourceScore', () => {
    it('should convert resources to token value', () => {
      const resources = { crops: 5, lumber: 2, ore: 1 };
      // crops: 5×1=5, lumber: 2×2=4, ore: 1×3=3 → total 12
      expect(calculateResourceScore(resources)).toBe(12);
    });

    it('should return 0 for empty resources', () => {
      expect(calculateResourceScore({})).toBe(0);
    });

    it('should correctly value gems', () => {
      const resources = { gems: 2, rare_gems: 1 };
      // 2×10 + 1×10 = 30
      expect(calculateResourceScore(resources)).toBe(30);
    });
  });

  describe('calculateScore', () => {
    it('should sum tokens + resource value for total score', () => {
      const player = {
        tokens: 20,
        resources: { crops: 5, ore: 2 },
        tradeProfit: 0,
      };
      // tokens: 20, crops: 5, ore: 6 → 31
      expect(calculateScore(player)).toBe(31);
    });

    it('should include trade profit in score', () => {
      const player = {
        tokens: 10,
        resources: {},
        tradeProfit: 15,
      };
      expect(calculateScore(player)).toBe(25);
    });

    it('should handle player with only tokens', () => {
      const player = { tokens: 50, resources: {}, tradeProfit: 0 };
      expect(calculateScore(player)).toBe(50);
    });
  });

  describe('getLeaderboardRank', () => {
    const players = [
      { id: 'p1', name: 'Alice', tokens: 40, resources: { ore: 2 }, tradeProfit: 5 },
      { id: 'p2', name: 'Bob', tokens: 20, resources: { gems: 1 }, tradeProfit: 0 },
      { id: 'p3', name: 'Carol', tokens: 30, resources: { crops: 10 }, tradeProfit: 10 },
    ];

    it('should rank players by total score descending', () => {
      const ranked = getLeaderboardRank(players);
      // Alice: 40+6+5=51, Bob: 20+10+0=30, Carol: 30+10+10=50
      expect(ranked[0].id).toBe('p1'); // Alice 51
      expect(ranked[1].id).toBe('p3'); // Carol 50
      expect(ranked[2].id).toBe('p2'); // Bob 30
    });

    it('should include rank number', () => {
      const ranked = getLeaderboardRank(players);
      expect(ranked[0].rank).toBe(1);
      expect(ranked[1].rank).toBe(2);
      expect(ranked[2].rank).toBe(3);
    });

    it('should include computed score in result', () => {
      const ranked = getLeaderboardRank(players);
      expect(ranked[0].score).toBe(51);
    });
  });
});
