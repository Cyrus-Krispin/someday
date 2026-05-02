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
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

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
      // error shown via AuthContext's error state
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBorder = (field: string) =>
    focusedField === field ? { borderColor: '#e94560' } : {};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>SOMEDAY</Text>
        <Text style={styles.subtitle}>Async World-Building Game</Text>

        <View style={styles.card}>
          {/* Tab row */}
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

          {/* Form */}
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d1a',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    maxWidth: 440,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#e94560',
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#4a5568',
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 36,
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f2a40',
    overflow: 'hidden',
  },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1f2a40',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
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
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#0f172a',
    color: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#1f2a40',
  },
  inputError: {
    borderColor: '#e94560',
  },
  fieldError: {
    color: '#e94560',
    fontSize: 12,
    marginTop: 4,
  },
  serverError: {
    color: '#e94560',
    fontSize: 13,
    marginTop: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(233, 69, 96, 0.1)',
    borderRadius: 6,
    padding: 8,
  },
  button: {
    backgroundColor: '#e94560',
    borderRadius: 8,
    padding: 14,
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
