import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PlayerHUDProps {
  tokens: number;
  movementRemaining: number;
  actionsRemaining: number;
  currentDay: number;
}

const PlayerHUD: React.FC<PlayerHUDProps> = ({ tokens, movementRemaining, actionsRemaining, currentDay }) => {
  return (
    <View testID="player-hud" style={styles.container}>
      <View style={styles.row}>
        <Text testID="hud-day" style={styles.label}>Day {currentDay}</Text>
        <Text testID="hud-tokens" style={styles.value}>{tokens} tokens</Text>
      </View>
      <View style={styles.row}>
        <Text testID="hud-movement" style={styles.label}>Movement: {movementRemaining}/6</Text>
        <Text testID="hud-actions" style={styles.label}>Actions: {actionsRemaining}/2</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: '#2c3e50',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  label: {
    color: '#ecf0f1',
    fontSize: 14,
  },
  value: {
    color: '#f1c40f',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default PlayerHUD;
