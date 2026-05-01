import {
  getBasePrice,
  calculateSellPrice,
  calculateBuyPrice,
  validateTrade,
} from '../utils/market';

describe('Market Utils', () => {
  describe('getBasePrice', () => {
    it('should return base token value for crops', () => expect(getBasePrice('crops')).toBe(1));
    it('should return base token value for fish', () => expect(getBasePrice('fish')).toBe(2));
    it('should return base token value for lumber', () => expect(getBasePrice('lumber')).toBe(2));
    it('should return base token value for ore', () => expect(getBasePrice('ore')).toBe(3));
    it('should return base token value for gems', () => expect(getBasePrice('gems')).toBe(10));
    it('should return base token value for rare_gems', () => expect(getBasePrice('rare_gems')).toBe(10));
    it('should return 0 for unknown resource', () => expect(getBasePrice('unknown')).toBe(0));
  });

  describe('calculateSellPrice', () => {
    it('should return base price × quantity during normal event', () => {
      expect(calculateSellPrice('ore', 3, null)).toBe(9); // 3 × 3
    });

    it('should double price during festival', () => {
      expect(calculateSellPrice('crops', 5, 'festival')).toBe(10); // 5 × 1 × 2
    });

    it('should not affect price during drought', () => {
      expect(calculateSellPrice('lumber', 2, 'drought')).toBe(4); // 2 × 2 × 1
    });

    it('should not affect price during token_rush', () => {
      expect(calculateSellPrice('gems', 1, 'token_rush')).toBe(10); // 1 × 10 × 1
    });
  });

  describe('calculateBuyPrice', () => {
    it('should return base price × quantity during normal event', () => {
      expect(calculateBuyPrice('crops', 4, null)).toBe(4); // 4 × 1
    });

    it('should double buy price during festival (prices are doubled)', () => {
      expect(calculateBuyPrice('ore', 2, 'festival')).toBe(12); // 2 × 3 × 2
    });

    it('should not affect buy price during token_rush', () => {
      expect(calculateBuyPrice('lumber', 3, 'token_rush')).toBe(6); // 3 × 2
    });
  });

  describe('validateTrade', () => {
    it('should allow sell when player has enough resources', () => {
      const playerResources = { crops: 5, lumber: 2 };
      const result = validateTrade('sell', 'crops', 3, playerResources, 10, null);
      expect(result.valid).toBe(true);
      expect(result.tokensChange).toBe(3); // 3 crops × 1 token each
    });

    it('should reject sell when player lacks resources', () => {
      const playerResources = { crops: 1 };
      const result = validateTrade('sell', 'crops', 3, playerResources, 10, null);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('crops');
    });

    it('should allow buy when player has enough tokens', () => {
      const playerResources = { crops: 0 };
      const result = validateTrade('buy', 'ore', 2, playerResources, 20, null);
      expect(result.valid).toBe(true);
      expect(result.tokensChange).toBe(-6); // -2 × 3
    });

    it('should reject buy when player has insufficient tokens', () => {
      const playerResources = {};
      const result = validateTrade('buy', 'gems', 2, playerResources, 15, null);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('tokens');
    });

    it('should account for festival when calculating buy cost', () => {
      const playerResources = {};
      // During festival, ore costs 6 each; 2 ore = 12 tokens
      const result = validateTrade('buy', 'ore', 2, playerResources, 10, 'festival');
      expect(result.valid).toBe(false); // 10 < 12
    });

    it('should account for festival when calculating sell revenue', () => {
      const playerResources = { crops: 5 };
      const result = validateTrade('sell', 'crops', 5, playerResources, 0, 'festival');
      expect(result.valid).toBe(true);
      expect(result.tokensChange).toBe(10); // 5 × 1 × 2 festival bonus
    });

    it('should reject zero or negative quantity', () => {
      const playerResources = { crops: 5 };
      const result = validateTrade('sell', 'crops', 0, playerResources, 10, null);
      expect(result.valid).toBe(false);
    });
  });
});
