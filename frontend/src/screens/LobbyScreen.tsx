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
  const {
    world,
    turnState,
    createWorld,
    joinWorld,
    rejoinWorld,
    loadWorldState,
    loadTurnState,
    loading,
    error,
  } = useGame();
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

  const hasWorld = myWorld !== null;
  const inGame = world !== null;
  const activeWorld = inGame ? world : myWorld;

  return (
    <View style={styles.flex}>
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
            <Text style={styles.pageTitle}>My Worlds</Text>

            {myWorldLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#e94560" />
              </View>
            ) : hasWorld ? (
              <View style={styles.worldCard}>
                <View style={styles.worldCardLeft}>
                  <Text style={styles.worldName}>World {activeWorld!.joinCode}</Text>
                  <View style={styles.worldMeta}>
                    <Text style={styles.worldMetaText}>
                      Day {activeWorld!.gameDay}
                    </Text>
                    <View style={styles.metaDivider} />
                    <Text style={styles.worldMetaText}>
                      {inGame
                        ? `${turnState?.players?.length ?? '?'} players`
                        : `${myWorld!.playerCount} players`}
                    </Text>
                  </View>
                  <Text style={styles.joinCodeHint}>
                    Share code: {activeWorld!.joinCode}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.enterBtn}
                  onPress={inGame ? handleEnterGame : handleRejoinGame}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.enterBtnText}>Enter</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.noWorldSection}>
                <Text style={styles.noWorldTitle}>No worlds yet</Text>
                <Text style={styles.noWorldSubtitle}>
                  Create a new world or join one with a code
                </Text>

                <View style={styles.terrainDots}>
                  <View style={[styles.dot, { backgroundColor: '#4a9ff5' }]} />
                  <View style={[styles.dot, { backgroundColor: '#7ec97e' }]} />
                  <View style={[styles.dot, { backgroundColor: '#2d752d' }]} />
                  <View style={[styles.dot, { backgroundColor: '#9a9a9a' }]} />
                  <View style={[styles.dot, { backgroundColor: '#f2dba0' }]} />
                </View>

                <TouchableOpacity
                  style={styles.createBtn}
                  onPress={handleCreateWorld}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.createBtnText}>Create New World</Text>
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
                    style={[
                      styles.joinBtn,
                      (!joinCode.trim() || loading) && styles.btnDisabled,
                    ]}
                    onPress={handleJoinWorld}
                    disabled={loading || !joinCode.trim()}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.joinBtnText}>Join</Text>
                    )}
                  </TouchableOpacity>
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}
              </View>
            )}
          </ScrollView>
        </View>
      </TerrainBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  overlay: {
    flex: 1,
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
    borderRadius: 8,
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
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 24,
    marginTop: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  worldCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.2)',
    padding: 20,
  },
  worldCardLeft: {
    flex: 1,
  },
  worldName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
  },
  worldMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  worldMetaText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  metaDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 10,
  },
  joinCodeHint: {
    fontSize: 12,
    color: '#4ade80',
  },
  enterBtn: {
    backgroundColor: '#4ade80',
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginLeft: 16,
  },
  enterBtnText: {
    color: '#0a0a2e',
    fontSize: 15,
    fontWeight: '700',
  },
  noWorldSection: {
    alignItems: 'center',
  },
  noWorldTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
  },
  noWorldSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    marginBottom: 20,
  },
  terrainDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    opacity: 0.8,
  },
  createBtn: {
    backgroundColor: '#e94560',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  createBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    alignSelf: 'stretch',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  dividerText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
    marginHorizontal: 12,
    letterSpacing: 1,
  },
  joinRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    gap: 10,
  },
  joinInput: {
    flex: 2,
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: '#ffffff',
    borderRadius: 10,
    padding: 14,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  joinBtn: {
    flex: 1,
    backgroundColor: '#e94560',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: {
    opacity: 0.4,
  },
  joinBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  error: {
    color: '#e94560',
    fontSize: 13,
    marginTop: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(233,69,96,0.1)',
    borderRadius: 8,
    padding: 10,
    alignSelf: 'stretch',
  },
});
