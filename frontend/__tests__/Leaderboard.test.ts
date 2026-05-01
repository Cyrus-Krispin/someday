import React from 'react';
import Leaderboard from '../components/Leaderboard';

interface TestPlayer {
  id: string;
  name: string;
  tokens: number;
  resources: Record<string, number>;
  tradeProfit: number;
}

describe('Leaderboard', () => {
  const players: TestPlayer[] = [
    { id: 'p1', name: 'Alice', tokens: 40, resources: { ore: 2 }, tradeProfit: 5 },
    { id: 'p2', name: 'Bob', tokens: 20, resources: { gems: 1 }, tradeProfit: 0 },
    { id: 'p3', name: 'Carol', tokens: 30, resources: { crops: 10 }, tradeProfit: 10 },
  ];

  it('should render without crashing', () => {
    const result = React.createElement(Leaderboard, { players });
    expect(result).toBeDefined();
  });

  it('should render with empty players list', () => {
    const result = React.createElement(Leaderboard, { players: [] });
    expect(result).toBeDefined();
  });
});
