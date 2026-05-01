import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signup, login, joinWorld as apiJoinWorld } from '../services/api';

type AuthTab = 'login' | 'signup' | 'join';

interface AuthScreenProps {
  onAuthSuccess: (token: string) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setError('');
    setLoading(true);
    try {
      let response;
      if (activeTab === 'signup') {
        response = await signup(email, password);
      } else if (activeTab === 'join') {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          setError('Please login or signup first');
          setLoading(false);
          return;
        }
        response = await apiJoinWorld(token, joinCode);
        if (response.data) {
          onAuthSuccess(token);
        }
        setLoading(false);
        return;
      } else {
        response = await login(email, password);
      }

      const { token } = response.data;
      await AsyncStorage.setItem('authToken', token);
      onAuthSuccess(token);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text testID="auth-title" style={styles.title}>Someday</Text>

      <View style={styles.tabRow}>
        {(['login', 'signup', 'join'] as AuthTab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            testID={`tab-${tab}`}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => { setActiveTab(tab); setError(''); }}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === 'login' ? 'Login' : tab === 'signup' ? 'Sign Up' : 'Join World'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab !== 'join' && (
        <>
          <TextInput
            testID="email-input"
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            testID="password-input"
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </>
      )}

      {activeTab === 'join' && (
        <TextInput
          testID="join-code-input"
          style={styles.input}
          placeholder="Enter join code"
          placeholderTextColor="#666"
          value={joinCode}
          onChangeText={setJoinCode}
          autoCapitalize="characters"
        />
      )}

      {error ? (
        <Text testID="auth-error" style={styles.error}>{error}</Text>
      ) : null}

      <TouchableOpacity
        testID="auth-submit"
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleAuth}
        disabled={loading}
      >
        <Text style={styles.submitText}>
          {loading ? 'Please wait...' : activeTab === 'login' ? 'Login' : activeTab === 'signup' ? 'Sign Up' : 'Join World'}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#1a1a2e',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#f1c40f',
    textAlign: 'center',
    marginBottom: 32,
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#333',
  },
  activeTab: {
    borderBottomColor: '#f1c40f',
  },
  tabText: {
    color: '#666',
    fontSize: 14,
  },
  activeTabText: {
    color: '#f1c40f',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#16213e',
    color: '#e0e0e0',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  error: {
    color: '#e74c3c',
    marginBottom: 12,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#2980b9',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#7f8c8d',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AuthScreen;
