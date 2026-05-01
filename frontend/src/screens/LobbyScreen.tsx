import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';

interface LobbyScreenProps {
  navigation: any;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({ navigation }) => {
  const { player, logout } = useAuth();
  const { world, createWorld, joinWorld, loadWorldState, loadTurnState, loading, error } = useGame();
  const [joinCode, setJoinCode] = useState('');

  const handleCreateWorld = async () => {
    try {
      await createWorld();
    } catch {}
  };

  const handleJoinWorld = async () => {
    if (!joinCode.trim()) return;
    try {
      await joinWorld(joinCode.trim().toUpperCase());
    } catch {}
  };

  const handleEnterGame = async () => {
    try {
      await loadWorldState();
      await loadTurnState();
      navigation.navigate('Game');
    } catch {}
  };

  const inWorld = world !== null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Someday</Text>
        <Text style={styles.email}>{player?.email}</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {inWorld ? (
          <View style={styles.card}>
            <Text style={styles.statusText}>You are in a world!</Text>
            <Text style={styles.joinCodeLabel}>Join Code</Text>
            <Text style={styles.joinCode}>{world.joinCode}</Text>
            <Text style={styles.info}>Game Day: {world.gameDay}</Text>
            <Text style={styles.info}>Share this code with friends to join</Text>

            <TouchableOpacity style={styles.button} onPress={handleEnterGame}>
              <Text style={styles.buttonText}>Enter Game</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Create or Join a World</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={handleCreateWorld}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Create New World</Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or join existing</Text>
              <View style={styles.dividerLine} />
            </View>

            <TextInput
              style={styles.input}
              value={joinCode}
              onChangeText={setJoinCode}
              placeholder="Enter join code (e.g. ABC123)"
              placeholderTextColor="#666"
              autoCapitalize="characters"
              maxLength={6}
            />

            <TouchableOpacity
              style={[styles.button, styles.joinButton]}
              onPress={handleJoinWorld}
              disabled={loading || !joinCode.trim()}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Join World</Text>
              )}
            </TouchableOpacity>

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e94560',
  },
  email: {
    fontSize: 14,
    color: '#a0a0b0',
    marginTop: 4,
  },
  logout: {
    color: '#e94560',
    fontSize: 14,
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#c0c0d0',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  statusText: {
    color: '#4ade80',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  joinCodeLabel: {
    color: '#a0a0b0',
    fontSize: 14,
    marginBottom: 4,
  },
  joinCode: {
    color: '#e94560',
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 6,
    marginBottom: 12,
  },
  info: {
    color: '#a0a0b0',
    fontSize: 14,
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#e94560',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
  },
  joinButton: {
    backgroundColor: '#0f3460',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  dividerText: {
    color: '#666',
    fontSize: 12,
    marginHorizontal: 12,
  },
  input: {
    backgroundColor: '#0f3460',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    width: '100%',
    textAlign: 'center',
    letterSpacing: 4,
    borderWidth: 1,
    borderColor: '#1a1a4e',
  },
  error: {
    color: '#e94560',
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
});
