import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

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
    <View style={styles.card}>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>
            <Text style={styles.statIcon}>💰 </Text>
            {tokens}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>
            <Text style={styles.statIcon}>⭐ </Text>
            {score}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>
            <Text style={styles.statIcon}>📅 </Text>
            {gameDay}
            <Text style={styles.statSub}>/30</Text>
          </Text>
        </View>
      </View>
      <View style={styles.bottomRow}>
        <View
          style={[
            styles.turnPill,
            isMyTurn ? styles.turnActive : styles.turnWaiting,
          ]}
        >
          <View
            style={[
              styles.turnDot,
              isMyTurn ? styles.dotActive : styles.dotWaiting,
            ]}
          />
          <Text
            style={[styles.turnText, isMyTurn && styles.turnTextActive]}
          >
            {isMyTurn ? 'Your Turn' : 'Waiting'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.hallBtn}
          onPress={onOpenTownHall}
          activeOpacity={0.7}
        >
          <Text style={styles.hallBtnText}>🏛️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(10, 14, 30, 0.84)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
      },
      default: {
        elevation: 10,
      },
    }),
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 12,
  },
  statValue: {
    color: '#e8e8f0',
    fontSize: 14,
    fontWeight: '700',
  },
  statSub: {
    color: '#6b6b80',
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  turnPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  turnActive: {
    backgroundColor: 'rgba(74, 222, 128, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.25)',
  },
  turnWaiting: {
    backgroundColor: 'rgba(250, 204, 21, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.15)',
  },
  turnDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: '#4ade80',
  },
  dotWaiting: {
    backgroundColor: '#facc15',
  },
  turnText: {
    color: '#a0a0b0',
    fontSize: 11,
    fontWeight: '600',
  },
  turnTextActive: {
    color: '#bbf7d0',
  },
  hallBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  hallBtnText: {
    fontSize: 16,
  },
});
