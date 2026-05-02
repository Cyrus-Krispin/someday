import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { TerrainBackground } from '../components/TerrainBackground';

interface AuthScreenProps {
  navigation: any;
}

interface LocalErrors {
  password?: string;
  confirmPassword?: string;
}

export const AuthScreen: React.FC<AuthScreenProps> = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localErrors, setLocalErrors] = useState<LocalErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { login, signup, error, clearError } = useAuth();

  const switchTab = (toLogin: boolean) => {
    setIsLogin(toLogin);
    setLocalErrors({});
    clearError();
  };

  const handleSubmit = async () => {
    if (!email || !password) return;

    if (!isLogin) {
      const errs: LocalErrors = {};
      if (password.length < 6) {
        errs.password = 'Password must be at least 6 characters';
      } else if (password !== confirmPassword) {
        errs.confirmPassword = 'Passwords do not match';
      }
      if (Object.keys(errs).length > 0) {
        setLocalErrors(errs);
        return;
      }
    }

    setLocalErrors({});
    setIsSubmitting(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBorder = (field: string) =>
    focusedField === field ? { borderColor: '#e94560' } : {};

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TerrainBackground>
        <View style={styles.overlay}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            <TouchableOpacity
              style={styles.signInBadge}
              onPress={() => {}}
              activeOpacity={0.7}
            >
              <Text style={styles.signInBadgeText}>Sign In</Text>
            </TouchableOpacity>

            <View style={styles.hero}>
              <Text style={styles.title}>SOMEDAY</Text>
              <Text style={styles.subtitle}>Async World-Building Game</Text>
              <View style={styles.titleAccent} />
            </View>

            <View style={styles.cardWrapper}>
              <View style={styles.cardGlow} />
              <View style={styles.card}>
                <View style={styles.tabRow}>
                  <TouchableOpacity
                    style={[styles.tab, isLogin && styles.tabActive]}
                    onPress={() => switchTab(true)}
                    accessibilityRole="tab"
                  >
                    <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>LOGIN</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.tab, !isLogin && styles.tabActive]}
                    onPress={() => switchTab(false)}
                    accessibilityRole="tab"
                  >
                    <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>SIGN UP</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.form}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={[styles.input, inputBorder('email')]}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@example.com"
                    placeholderTextColor="#4a5568"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />

                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={[styles.input, inputBorder('password'), localErrors.password ? styles.inputError : undefined]}
                    value={password}
                    onChangeText={(v) => {
                      setPassword(v);
                      if (localErrors.password) setLocalErrors(e => ({ ...e, password: undefined }));
                    }}
                    placeholder="Password"
                    placeholderTextColor="#4a5568"
                    secureTextEntry
                    autoComplete={isLogin ? 'password' : 'new-password'}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                  />
                  {localErrors.password ? (
                    <Text style={styles.fieldError}>{localErrors.password}</Text>
                  ) : null}

                  {!isLogin && (
                    <>
                      <Text style={styles.label}>Confirm Password</Text>
                      <TextInput
                        style={[styles.input, inputBorder('confirm'), localErrors.confirmPassword ? styles.inputError : undefined]}
                        value={confirmPassword}
                        onChangeText={(v) => {
                          setConfirmPassword(v);
                          if (localErrors.confirmPassword) setLocalErrors(e => ({ ...e, confirmPassword: undefined }));
                        }}
                        placeholder="Confirm password"
                        placeholderTextColor="#4a5568"
                        secureTextEntry
                        onFocus={() => setFocusedField('confirm')}
                        onBlur={() => setFocusedField(null)}
                      />
                      {localErrors.confirmPassword ? (
                        <Text style={styles.fieldError}>{localErrors.confirmPassword}</Text>
                      ) : null}
                    </>
                  )}

                  {error ? <Text style={styles.serverError}>{error}</Text> : null}

                  <TouchableOpacity
                    style={[styles.button, isSubmitting && styles.buttonDisabled]}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                    role="button"
                    accessibilityLabel={isLogin ? 'Log In' : 'Sign Up'}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>
                        {isLogin ? 'Log In' : 'Sign Up'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </TerrainBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 40,
    minHeight: '100%',
  },
  signInBadge: {
    position: 'absolute',
    top: 60,
    right: 24,
    backgroundColor: 'rgba(233,69,96,0.15)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(233,69,96,0.3)',
    zIndex: 10,
  },
  signInBadgeText: {
    color: '#e94560',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  hero: {
    alignItems: 'center',
    paddingTop: 120,
    paddingBottom: 20,
  },
  title: {
    fontSize: 56,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 12,
    textShadow: '0 0 40px rgba(233, 69, 96, 0.5)',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginTop: 12,
  },
  titleAccent: {
    width: 60,
    height: 2,
    backgroundColor: '#e94560',
    borderRadius: 1,
    marginTop: 16,
    opacity: 0.6,
  },
  cardWrapper: {
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: 'center',
  },
  cardGlow: {
    position: 'absolute',
    top: 28,
    left: 32,
    right: 32,
    height: 120,
    backgroundColor: '#e94560',
    borderRadius: 20,
    opacity: 0.08,
    zIndex: 0,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(31, 42, 64, 0.8)',
    overflow: 'hidden',
    zIndex: 1,
  },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(31, 42, 64, 0.8)',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#e94560',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#4a5568',
  },
  tabTextActive: {
    color: '#e94560',
  },
  form: {
    padding: 24,
  },
  label: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    color: '#f1f5f9',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(31, 42, 64, 0.8)',
  },
  inputError: {
    borderColor: '#e94560',
  },
  fieldError: {
    color: '#e94560',
    fontSize: 12,
    marginTop: 6,
  },
  serverError: {
    color: '#e94560',
    fontSize: 13,
    marginTop: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(233, 69, 96, 0.1)',
    borderRadius: 8,
    padding: 10,
  },
  button: {
    backgroundColor: '#e94560',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
