import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { useGame } from '../contexts/GameContext';
import { MAX_MOVEMENT, MAX_ACTIONS } from '../services/gameUtils';
import type { QueuedAction } from '../types';

interface ActionPanelProps {
  isMyTurn: boolean;
  onEndTurn: () => void;
  loading: boolean;
  error: string | null;
}

const actionLabel = (action: QueuedAction): string => {
  if (action.type === 'move') {
    return `Move → (${action.targetX}, ${action.targetY})`;
  }
  if (action.type === 'gather') {
    return `Gather at (${action.targetX}, ${action.targetY})`;
  }
  if (action.type === 'work') {
    return `Work${action.structureType ? ` at ${action.structureType}` : ''}`;
  }
  return action.type;
};

export const ActionPanel: React.FC<ActionPanelProps> = ({
  isMyTurn,
  onEndTurn,
  loading,
  error,
}) => {
  const { queuedActions, movementRemaining, actionsRemaining, clearActions } = useGame();

  const canEndTurn = isMyTurn && !loading;
  const canClear = queuedActions.length > 0 && !loading;

  return (
    <View style={styles.card}>
      <View style={styles.statsRow}>
        <View style={styles.chip}>
          <Text style={styles.chipText}>
            🚶 {movementRemaining}/{MAX_MOVEMENT}
          </Text>
        </View>
        <View style={styles.chip}>
          <Text style={styles.chipText}>
            ⚡ {actionsRemaining}/{MAX_ACTIONS}
          </Text>
        </View>
        <View style={styles.chip}>
          <Text style={styles.chipText}>📋 {queuedActions.length}</Text>
        </View>
      </View>

      {queuedActions.length > 0 && (
        <ScrollView
          style={styles.queueList}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {queuedActions.map((action, i) => (
            <View key={i} style={styles.queueItem}>
              <Text style={styles.queueItemText}>{actionLabel(action)}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.clearButton, !canClear && styles.disabledButton]}
          onPress={clearActions}
          disabled={!canClear}
          activeOpacity={0.7}
        >
          <Text style={[styles.clearButtonText, !canClear && styles.disabledText]}>
            Clear
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.endTurnButton, !canEndTurn && styles.disabledButton]}
          onPress={onEndTurn}
          disabled={!canEndTurn}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={[styles.endTurnText, !canEndTurn && styles.disabledText]}>
              {isMyTurn ? 'End Turn' : 'Waiting...'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {!!error && <Text style={styles.errorText}>{error}</Text>}
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
    paddingVertical: 12,
    minWidth: 240,
    maxWidth: 360,
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
    gap: 6,
    marginBottom: 8,
  },
  chip: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  chipText: {
    color: '#c0c0d0',
    fontSize: 12,
    fontWeight: '600',
  },
  queueList: {
    marginBottom: 8,
    maxHeight: 30,
  },
  queueItem: {
    backgroundColor: 'rgba(15, 52, 96, 0.5)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    borderWidth: 1,
    borderColor: 'rgba(15, 52, 96, 0.4)',
  },
  queueItemText: {
    color: '#a0c0f0',
    fontSize: 11,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  clearButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  clearButtonText: {
    color: '#a0a0d0',
    fontSize: 13,
    fontWeight: '600',
  },
  endTurnButton: {
    flex: 2,
    backgroundColor: '#e94560',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#e94560',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      default: {
        elevation: 4,
      },
    }),
  },
  endTurnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.35,
  },
  disabledText: {
    opacity: 0.6,
  },
  errorText: {
    color: '#f87171',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
  },
});
