import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
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
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <View style={styles.statChip}>
          <Text style={styles.statLabel}>Move</Text>
          <Text style={styles.statValue}>
            {movementRemaining}/{MAX_MOVEMENT}
          </Text>
        </View>
        <View style={styles.statChip}>
          <Text style={styles.statLabel}>Actions</Text>
          <Text style={styles.statValue}>
            {actionsRemaining}/{MAX_ACTIONS}
          </Text>
        </View>
        <View style={styles.statChip}>
          <Text style={styles.statLabel}>Queued</Text>
          <Text style={styles.statValue}>{queuedActions.length}</Text>
        </View>
      </View>

      {queuedActions.length > 0 && (
        <ScrollView style={styles.queueList} horizontal showsHorizontalScrollIndicator={false}>
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
        >
          <Text style={[styles.clearButtonText, !canClear && styles.disabledText]}>
            Clear
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.endTurnButton, !canEndTurn && styles.disabledButton]}
          onPress={onEndTurn}
          disabled={!canEndTurn}
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
  container: {
    backgroundColor: '#16213e',
    borderTopWidth: 1,
    borderTopColor: '#2a2a4e',
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  statChip: {
    flex: 1,
    backgroundColor: '#0f0f1e',
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
  },
  statLabel: {
    color: '#666',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  statValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  queueList: {
    marginBottom: 8,
    maxHeight: 36,
  },
  queueItem: {
    backgroundColor: '#0f3460',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
  },
  queueItemText: {
    color: '#a0c0f0',
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#2a2a4e',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#a0a0d0',
    fontSize: 15,
    fontWeight: '600',
  },
  endTurnButton: {
    flex: 2,
    backgroundColor: '#e94560',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  endTurnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.4,
  },
  disabledText: {
    opacity: 0.6,
  },
  errorText: {
    color: '#e94560',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
});
