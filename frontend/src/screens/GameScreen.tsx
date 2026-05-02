import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
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
    moveInDirection,
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

  const isMyTurn = turnState?.isPlayerTurn ?? false;

  useEffect(() => {
    if (!isMyTurn) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':    e.preventDefault(); moveInDirection(0, -1); break;
        case 'ArrowDown':  e.preventDefault(); moveInDirection(0,  1); break;
        case 'ArrowLeft':  e.preventDefault(); moveInDirection(-1, 0); break;
        case 'ArrowRight': e.preventDefault(); moveInDirection( 1, 0); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMyTurn, moveInDirection]);

  const handleEndTurn = async () => {
    try {
      await endTurn();
      await refreshProfile();
    } catch {}
  };

  return (
    <View style={styles.container}>
      {/* Map fills the entire screen */}
      <View style={styles.mapLayer}>
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

      {/* HUD overlaid at top */}
      <View style={styles.hudOverlay}>
        <PlayerHUD
          tokens={player?.tokens ?? 0}
          score={player?.score ?? 0}
          gameDay={world?.gameDay ?? 0}
          isMyTurn={isMyTurn}
          onOpenTownHall={() => navigation.navigate('TownHall')}
        />
      </View>

      {/* Action panel overlaid at bottom */}
      <View style={styles.actionOverlay}>
        <ActionPanel
          isMyTurn={isMyTurn}
          onEndTurn={handleEndTurn}
          loading={loading}
          error={error}
        />
      </View>

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
    position: 'relative',
  },
  mapLayer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
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
  hudOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  actionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  gameOverOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#e94560',
    padding: 16,
    alignItems: 'center',
    zIndex: 20,
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
