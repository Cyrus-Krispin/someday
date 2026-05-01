import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { TileGrid } from '../components/TileGrid';
import { PlayerHUD } from '../components/PlayerHUD';
import { ActionPanel } from '../components/ActionPanel';
import { listenForTurnStart } from '../services/socket';

interface GameScreenProps {
  navigation: any;
}

export const GameScreen: React.FC<GameScreenProps> = ({ navigation }) => {
  const { player, refreshProfile } = useAuth();
  const {
    world,
    tiles,
    turnState,
    loadWorldState,
    loadTurnState,
    loading,
    error,
    endTurn,
  } = useGame();

  useEffect(() => {
    loadWorldState();
    loadTurnState();
  }, [loadWorldState, loadTurnState]);

  useEffect(() => {
    const cleanup = listenForTurnStart(() => {
      loadTurnState();
      loadWorldState();
      refreshProfile();
    });
    return cleanup;
  }, [loadTurnState, loadWorldState, refreshProfile]);

  const handleEndTurn = async () => {
    try {
      await endTurn();
      await refreshProfile();
    } catch {}
  };

  const isMyTurn = turnState?.isPlayerTurn ?? false;

  return (
    <View style={styles.container}>
      <PlayerHUD
        tokens={player?.tokens ?? 0}
        score={player?.score ?? 0}
        gameDay={world?.gameDay ?? 0}
        isMyTurn={isMyTurn}
        onOpenTownHall={() => navigation.navigate('TownHall')}
      />

      <View style={styles.gridContainer}>
        {tiles.length > 0 ? (
          <TileGrid
            tiles={tiles}
            playerId={player?.id ?? ''}
            playerX={player?.x ?? 0}
            playerY={player?.y ?? 0}
            turnState={turnState}
          />
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#e94560" size="large" />
            <Text style={styles.loadingText}>Loading world...</Text>
          </View>
        )}
      </View>

      <ActionPanel
        isMyTurn={isMyTurn}
        onEndTurn={handleEndTurn}
        loading={loading}
        error={error}
      />

      {world?.status === 'COMPLETED' && (
        <TouchableOpacity
          style={styles.gameOverOverlay}
          onPress={() => navigation.navigate('GameOver')}
        >
          <Text style={styles.gameOverText}>Game Over!</Text>
          <Text style={styles.gameOverSubtext}>Tap to see results</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  gridContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    color: '#a0a0b0',
    marginTop: 12,
    fontSize: 16,
  },
  gameOverOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#e94560',
    padding: 16,
    alignItems: 'center',
  },
  gameOverText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  gameOverSubtext: {
    color: '#ffd0d0',
    fontSize: 14,
    marginTop: 4,
  },
});
