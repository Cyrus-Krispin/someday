import { getResourceValue } from './gather';

interface PlayerState {
  tokens: number;
  resources: Record<string, number>;
  tradeProfit: number;
}

interface RankedPlayer extends PlayerState {
  id: string;
  name: string;
  rank: number;
  score: number;
}

export const calculateResourceScore = (resources: Record<string, number>): number =>
  Object.entries(resources).reduce(
    (total, [type, qty]) => total + getResourceValue(type) * qty,
    0
  );

export const calculateScore = (player: PlayerState): number =>
  player.tokens + calculateResourceScore(player.resources) + player.tradeProfit;

export const getLeaderboardRank = (
  players: (PlayerState & { id: string; name: string })[]
): RankedPlayer[] =>
  [...players]
    .map((p) => ({ ...p, score: calculateScore(p) }))
    .sort((a, b) => b.score - a.score)
    .map((p, i) => ({ ...p, rank: i + 1 }));
