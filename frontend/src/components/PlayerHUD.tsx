import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PlayerHUDProps {
  tokens: number;
  score: number;
  gameDay: number;
  isMyTurn: boolean;
  onOpenTownHall: () => void;
}

export const PlayerHUD: React.FC<PlayerHUDProps> = ({
  tokens,
  score,
  gameDay,
  isMyTurn,
  onOpenTownHall,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Tokens</Text>
          <Text style={styles.statValue}>{tokens}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Score</Text>
          <Text style={styles.statValue}>{score}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Day</Text>
          <Text style={styles.statValue}>{gameDay}/30</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={[styles.turnIndicator, isMyTurn ? styles.yourTurn : styles.notYourTurn]}>
          <Text style={styles.turnText}>
            {isMyTurn ? '🟢 YOUR TURN' : '⏳ Waiting...'}
          </Text>
        </View>
        <TouchableOpacity style={styles.townHallButton} onPress={onOpenTownHall}>
          <Text style={styles.townHallText}>🏛️ Hall</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#16213e',
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a4e',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: '#666',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  turnIndicator: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: 8,
  },
  yourTurn: {
    backgroundColor: '#1a472a',
  },
  notYourTurn: {
    backgroundColor: '#3a3a1a',
  },
  turnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  townHallButton: {
    backgroundColor: '#0f3460',
    padding: 8,
    borderRadius: 6,
    paddingHorizontal: 16,
  },
  townHallText: {
    color: '#a0a0d0',
    fontSize: 14,
  },
});
