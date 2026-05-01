import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useGame } from '../contexts/GameContext';
import { useAuth } from '../contexts/AuthContext';

interface TownHallScreenProps {
  navigation: any;
}

export const TownHallScreen: React.FC<TownHallScreenProps> = ({ navigation }) => {
  const { turnState, world } = useGame();
  const { player } = useAuth();

  const players = turnState?.players ?? [];
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Town Hall</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.worldInfo}>
        <Text style={styles.worldInfoText}>Game Day: {world?.gameDay ?? '?'}</Text>
        <Text style={styles.worldInfoText}>Status: {world?.status ?? '?'}</Text>
      </View>

      <View style={styles.leaderboardSection}>
        <Text style={styles.sectionTitle}>Leaderboard</Text>

        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { flex: 0.6 }]}>Rank</Text>
          <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Player</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Score</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Tokens</Text>
        </View>

        <FlatList
          data={sortedPlayers}
          keyExtractor={(p) => p.id}
          renderItem={({ item, index }) => {
            const isMe = item.id === player?.id;
            const medals = ['🥇', '🥈', '🥉'];

            return (
              <View style={[styles.playerRow, isMe && styles.myRow]}>
                <View style={[styles.cell, { flex: 0.6 }]}>
                  <Text style={styles.rankText}>
                    {index < 3 ? medals[index] : `#${index + 1}`}
                  </Text>
                </View>
                <View style={[styles.cell, { flex: 2 }]}>
                  <Text style={[styles.playerName, isMe && styles.myName]}>
                    {item.email.split('@')[0]}
                    {isMe ? ' (You)' : ''}
                  </Text>
                </View>
                <View style={[styles.cell, { flex: 1.5 }]}>
                  <Text style={styles.scoreText}>{item.score}</Text>
                </View>
                <View style={[styles.cell, { flex: 1.5 }]}>
                  <Text style={styles.tokensText}>{item.tokens}</Text>
                </View>
              </View>
            );
          }}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('GameOver')}
      >
        <Text style={styles.buttonText}>View Game Over Screen</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a4e',
  },
  back: {
    color: '#e94560',
    fontSize: 16,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  worldInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: '#16213e',
  },
  worldInfoText: {
    color: '#a0a0b0',
    fontSize: 14,
  },
  leaderboardSection: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    color: '#e94560',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a4e',
    marginBottom: 4,
  },
  tableHeaderCell: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  playerRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a3e',
    alignItems: 'center',
  },
  myRow: {
    backgroundColor: '#16213e',
    borderRadius: 8,
  },
  cell: {
    paddingHorizontal: 4,
  },
  rankText: {
    color: '#fff',
    fontSize: 16,
  },
  playerName: {
    color: '#c0c0d0',
    fontSize: 15,
  },
  myName: {
    color: '#e94560',
    fontWeight: '600',
  },
  scoreText: {
    color: '#4ade80',
    fontSize: 16,
    fontWeight: '600',
  },
  tokensText: {
    color: '#facc15',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0f3460',
    padding: 14,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#a0a0d0',
    fontSize: 14,
  },
});
