import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ActionPanelProps {
  canGather: boolean;
  canWork: boolean;
  onGather: () => void;
  onWork: () => void;
  onEndTurn: () => void;
}

const ActionPanel: React.FC<ActionPanelProps> = ({ canGather, canWork, onGather, onWork, onEndTurn }) => {
  return (
    <View testID="action-panel" style={styles.container}>
      <TouchableOpacity
        testID="gather-button"
        style={[styles.button, !canGather && styles.buttonDisabled]}
        onPress={onGather}
        disabled={!canGather}
      >
        <Text style={styles.buttonText}>Gather</Text>
      </TouchableOpacity>

      <TouchableOpacity
        testID="work-button"
        style={[styles.button, !canWork && styles.buttonDisabled]}
        onPress={onWork}
        disabled={!canWork}
      >
        <Text style={styles.buttonText}>Work</Text>
      </TouchableOpacity>

      <TouchableOpacity
        testID="end-turn-button"
        style={[styles.button, styles.endTurnButton]}
        onPress={onEndTurn}
      >
        <Text style={styles.buttonText}>End Turn</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    backgroundColor: '#34495e',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2980b9',
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#7f8c8d',
    opacity: 0.5,
  },
  endTurnButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ActionPanel;
