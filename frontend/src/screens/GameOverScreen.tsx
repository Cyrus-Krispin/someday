import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useGame } from '../contexts/GameContext';
import { useAuth } from '../contexts/AuthContext';

interface GameOverScreenProps {
  navigation: any;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ navigation }) => {
  const { turnState, world } = useGame();
  const { player } = useAuth();

  const players = turnState?.players ?? [];
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];
  const myRank = sortedPlayers.findIndex(p => p.id === player?.id) + 1;

  const isWinner = winner?.id === player?.id;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Game Over!</Text>
        <Text style={styles.subtitle}>After 30 game days</Text>

        <View style={styles.winnerSection}>
          <Text style={styles.trophy}>{isWinner ? '🏆' : '🎮'}</Text>
          <Text style={styles.winnerLabel}>
            {isWinner ? 'YOU WON!' : 'Winner'}
          </Text>
          {winner && (
            <>
              <Text style={styles.winnerName}>
                {winner.email.split('@')[0]}
              </Text>
              <Text style={styles.winnerScore}>{winner.score} points</Text>
            </>
          )}
        </View>

        {!isWinner && (
          <Text style={styles.rankText}>
            You placed #{myRank} with {player?.score ?? 0} points
          </Text>
        )}

        <View style={styles.standings}>
          <Text style={styles.standingsTitle}>Final Standings</Text>
          {sortedPlayers.map((p, i) => {
            const medals = ['🥇', '🥈', '🥉'];
            const isMe = p.id === player?.id;

            return (
              <View key={p.id} style={[styles.standingsRow, isMe && styles.myStandingsRow]}>
                <Text style={styles.standingsRank}>
                  {i < 3 ? medals[i] : `#${i + 1}`}
                </Text>
                <Text style={[styles.standingsName, isMe && styles.myName]}>
                  {p.email.split('@')[0]}
                  {isMe ? ' (You)' : ''}
                </Text>
                <Text style={styles.standingsScore}>{p.score} pts</Text>
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Lobby')}
        >
          <Text style={styles.buttonText}>Back to Lobby</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#e94560',
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0b0',
    marginBottom: 32,
  },
  winnerSection: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 24,
    width: '100%',
  },
  trophy: {
    fontSize: 48,
    marginBottom: 8,
  },
  winnerLabel: {
    color: '#facc15',
    fontSize: 18,
    fontWeight: '600',
  },
  winnerName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  winnerScore: {
    color: '#4ade80',
    fontSize: 20,
    marginTop: 4,
  },
  rankText: {
    color: '#a0a0b0',
    fontSize: 16,
    marginBottom: 24,
  },
  standings: {
    width: '100%',
    marginBottom: 24,
  },
  standingsTitle: {
    color: '#c0c0d0',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  standingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a3e',
    alignItems: 'center',
  },
  myStandingsRow: {
    backgroundColor: '#16213e',
    borderRadius: 8,
  },
  standingsRank: {
    color: '#fff',
    fontSize: 16,
    width: 40,
  },
  standingsName: {
    color: '#c0c0d0',
    fontSize: 15,
    flex: 1,
  },
  myName: {
    color: '#e94560',
    fontWeight: '600',
  },
  standingsScore: {
    color: '#4ade80',
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#e94560',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
