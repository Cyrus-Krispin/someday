const BASE_PRICES: Record<string, number> = {
  crops: 1,
  fish: 2,
  lumber: 2,
  ore: 3,
  gems: 10,
  rare_gems: 10,
};

const getPriceMultiplier = (worldEvent: string | null): number =>
  worldEvent === 'festival' ? 2 : 1;

export const getBasePrice = (resourceType: string): number =>
  BASE_PRICES[resourceType] ?? 0;

export const calculateSellPrice = (
  resourceType: string,
  quantity: number,
  worldEvent: string | null
): number => getBasePrice(resourceType) * quantity * getPriceMultiplier(worldEvent);

export const calculateBuyPrice = (
  resourceType: string,
  quantity: number,
  worldEvent: string | null
): number => getBasePrice(resourceType) * quantity * getPriceMultiplier(worldEvent);

type TradeType = 'buy' | 'sell';

interface TradeResult {
  valid: boolean;
  tokensChange?: number;
  reason?: string;
}

export const validateTrade = (
  tradeType: TradeType,
  resourceType: string,
  quantity: number,
  playerResources: Record<string, number>,
  playerTokens: number,
  worldEvent: string | null
): TradeResult => {
  if (quantity <= 0) {
    return { valid: false, reason: 'Quantity must be greater than zero' };
  }

  if (tradeType === 'sell') {
    const owned = playerResources[resourceType] ?? 0;
    if (owned < quantity) {
      return { valid: false, reason: `Not enough ${resourceType} to sell (have ${owned}, need ${quantity})` };
    }
    const tokensChange = calculateSellPrice(resourceType, quantity, worldEvent);
    return { valid: true, tokensChange };
  }

  // buy
  const cost = calculateBuyPrice(resourceType, quantity, worldEvent);
  if (playerTokens < cost) {
    return { valid: false, reason: `Not enough tokens (have ${playerTokens}, need ${cost})` };
  }
  return { valid: true, tokensChange: -cost };
};
