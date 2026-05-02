import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { api } from '../api/client';
import type { MyWorld } from '../types';
import { TerrainBackground } from '../components/TerrainBackground';

interface LobbyScreenProps {
  navigation: any;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({ navigation }) => {
  const { player, logout, refreshProfile } = useAuth();
  const { world, createWorld, joinWorld, rejoinWorld, loadWorldState, loadTurnState, loading, error } = useGame();
  const [joinCode, setJoinCode] = useState('');
  const [myWorld, setMyWorld] = useState<MyWorld | null>(null);
  const [myWorldLoading, setMyWorldLoading] = useState(false);

  const fetchMyWorld = useCallback(async () => {
    if (!player?.world_id) {
      setMyWorld(null);
      return;
    }
    setMyWorldLoading(true);
    try {
      const data = await api.getMyWorld();
      setMyWorld(data.world);
    } catch {
      setMyWorld(null);
    } finally {
      setMyWorldLoading(false);
    }
  }, [player?.world_id]);

  useEffect(() => {
    fetchMyWorld();
  }, [fetchMyWorld]);

  const handleCreateWorld = async () => {
    try {
      await createWorld();
      await refreshProfile();
    } catch {}
  };

  const handleJoinWorld = async () => {
    if (!joinCode.trim()) return;
    try {
      await joinWorld(joinCode.trim().toUpperCase());
      await refreshProfile();
    } catch {}
  };

  const handleEnterGame = async () => {
    try {
      await loadWorldState();
      await loadTurnState();
      navigation.navigate('Game');
    } catch {}
  };

  const handleRejoinGame = async () => {
    try {
      await rejoinWorld();
      await loadWorldState();
      await loadTurnState();
      navigation.navigate('Game');
    } catch {}
  };

  const showMyWorld = myWorld !== null;
  const inWorld = world !== null;

  return (
    <TerrainBackground>
      <View style={styles.overlay}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back</Text>
            <Text style={styles.email}>{player?.email}</Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {(showMyWorld && !inWorld) || inWorld ? (
            <View style={styles.content}>
              <View style={styles.worldCardGlow} />
              <View style={styles.worldCard}>
                <View style={styles.worldCardHeader}>
                  <Text style={styles.worldIcon}>🌍</Text>
                  <View>
                    <Text style={styles.worldCardTitle}>My World</Text>
                    {inWorld && (
                      <Text style={styles.worldCardSubtitle}>You're in a game</Text>
                    )}
                  </View>
                </View>

                <View style={styles.joinCodeSection}>
                  <Text style={styles.joinCodeLabel}>Join Code</Text>
                  <Text style={styles.joinCode}>
                    {(inWorld ? world : myWorld!).joinCode}
                  </Text>
                  <Text style={styles.joinCodeHint}>Share this code with friends</Text>
                </View>

                <View style={styles.worldStats}>
                  <View style={styles.stat}>
                    <Text style={styles.statValue}>
                      {inWorld ? world.gameDay : myWorld!.gameDay}
                    </Text>
                    <Text style={styles.statLabel}>Game Day</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.stat}>
                    <Text style={styles.statValue}>
                      {inWorld ? world.players.length : myWorld!.playerCount} / 3
                    </Text>
                    <Text style={styles.statLabel}>Players</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.enterButton}
                  onPress={inWorld ? handleEnterGame : handleRejoinGame}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.enterButtonText}>Enter Game</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.content}>
              <View style={styles.createCardGlow} />
              <View style={styles.createCard}>
                <Text style={styles.sectionTitle}>Begin a New Journey</Text>
                <Text style={styles.sectionSubtitle}>
                  Create a world or join one with a code
                </Text>

                <View style={styles.terrainRow}>
                  <View style={[styles.terrainDot, { backgroundColor: '#4a9ff5' }]} />
                  <View style={[styles.terrainDot, { backgroundColor: '#7ec97e' }]} />
                  <View style={[styles.terrainDot, { backgroundColor: '#2d752d' }]} />
                  <View style={[styles.terrainDot, { backgroundColor: '#9a9a9a' }]} />
                  <View style={[styles.terrainDot, { backgroundColor: '#f2dba0' }]} />
                </View>

                <TouchableOpacity
                  style={styles.createButton}
                  onPress={handleCreateWorld}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.createButtonText}>Create New World</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or join existing</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.joinRow}>
                  <TextInput
                    style={styles.joinInput}
                    value={joinCode}
                    onChangeText={setJoinCode}
                    placeholder="Enter code"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    autoCapitalize="characters"
                    maxLength={6}
                  />
                  <TouchableOpacity
                    style={[styles.joinButton, (!joinCode.trim() || loading) && styles.joinButtonDisabled]}
                    onPress={handleJoinWorld}
                    disabled={loading || !joinCode.trim()}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.joinButtonText}>Join</Text>
                    )}
                  </TouchableOpacity>
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </TerrainBackground>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  email: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  logoutText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
    alignItems: 'center',
  },
  worldCardGlow: {
    position: 'absolute',
    top: 4,
    left: 28,
    right: 28,
    height: 140,
    backgroundColor: '#4ade80',
    borderRadius: 20,
    opacity: 0.06,
    zIndex: 0,
  },
  worldCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.15)',
    padding: 28,
    zIndex: 1,
  },
  worldCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  worldIcon: {
    fontSize: 32,
    marginRight: 14,
  },
  worldCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  worldCardSubtitle: {
    fontSize: 13,
    color: '#4ade80',
    marginTop: 2,
    fontWeight: '500',
  },
  joinCodeSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  joinCodeLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  joinCode: {
    fontSize: 40,
    fontWeight: '800',
    color: '#4ade80',
    letterSpacing: 8,
    textShadow: '0 0 20px rgba(74, 222, 128, 0.3)',
  },
  joinCodeHint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    marginTop: 6,
  },
  worldStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  stat: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  enterButton: {
    backgroundColor: '#4ade80',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  enterButtonText: {
    color: '#0a0a2e',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  createCardGlow: {
    position: 'absolute',
    top: 4,
    left: 28,
    right: 28,
    height: 140,
    backgroundColor: '#e94560',
    borderRadius: 20,
    opacity: 0.06,
    zIndex: 0,
  },
  createCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(31, 42, 64, 0.8)',
    padding: 28,
    zIndex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  terrainRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  terrainDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    opacity: 0.8,
  },
  createButton: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  dividerText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
    marginHorizontal: 12,
    letterSpacing: 1,
  },
  joinRow: {
    flexDirection: 'row',
    gap: 10,
  },
  joinInput: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: '#ffffff',
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 6,
    borderWidth: 1,
    borderColor: 'rgba(31, 42, 64, 0.8)',
  },
  joinButton: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButtonDisabled: {
    opacity: 0.4,
  },
  joinButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
  },
  error: {
    color: '#e94560',
    fontSize: 13,
    marginTop: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(233, 69, 96, 0.1)',
    borderRadius: 8,
    padding: 10,
  },
});
