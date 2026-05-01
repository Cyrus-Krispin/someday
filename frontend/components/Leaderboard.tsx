import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getLeaderboardRank } from '../utils/score';

interface LeaderboardPlayer {
  id: string;
  name: string;
  tokens: number;
  resources: Record<string, number>;
  tradeProfit: number;
}

interface LeaderboardProps {
  players: LeaderboardPlayer[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players }) => {
  const ranked = getLeaderboardRank(players);

  return (
    <View testID="leaderboard" style={styles.container}>
      <Text testID="leaderboard-title" style={styles.title}>Leaderboard</Text>
      {ranked.map((player) => (
        <View key={player.id} testID={`leaderboard-row-${player.rank}`} style={styles.row}>
          <Text style={styles.rank}>#{player.rank}</Text>
          <Text style={styles.name}>{player.name}</Text>
          <Text style={styles.score}>{player.score} pts</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#1a1a2e',
  },
  title: {
    color: '#f1c40f',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  rank: {
    color: '#e0e0e0',
    fontSize: 14,
    fontWeight: 'bold',
    width: 30,
  },
  name: {
    color: '#e0e0e0',
    fontSize: 14,
    flex: 1,
  },
  score: {
    color: '#f1c40f',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Leaderboard;
