import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();

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

      {/* HUD floating card — top left */}
      <View
        style={[
          styles.hudOverlay,
          { top: insets.top + 10, left: insets.left + 10 },
        ]}
        pointerEvents="box-none"
      >
        <PlayerHUD
          tokens={player?.tokens ?? 0}
          score={player?.score ?? 0}
          gameDay={world?.gameDay ?? 0}
          isMyTurn={isMyTurn}
          onOpenTownHall={() => navigation.navigate('TownHall')}
        />
      </View>

      {/* Action panel floating card — bottom right */}
      <View
        style={[
          styles.actionOverlay,
          { bottom: insets.bottom + 10, right: insets.right + 10 },
        ]}
        pointerEvents="box-none"
      >
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
          activeOpacity={0.85}
        >
          <View style={styles.gameOverCard}>
            <Text style={styles.gameOverText}>Game Over</Text>
            <Text style={styles.gameOverSubtext}>Tap to see results</Text>
          </View>
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
    overflow: 'hidden',
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
    zIndex: 10,
  },
  actionOverlay: {
    position: 'absolute',
    zIndex: 10,
  },
  gameOverOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  gameOverCard: {
    backgroundColor: '#1e1e3a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e94560',
    paddingHorizontal: 36,
    paddingVertical: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#e94560',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      default: {
        elevation: 12,
      },
    }),
  },
  gameOverText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  gameOverSubtext: {
    color: '#ff9090',
    fontSize: 14,
    marginTop: 6,
  },
});
