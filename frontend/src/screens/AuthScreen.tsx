import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { TerrainBackground } from '../components/TerrainBackground';

interface AuthScreenProps {
  navigation: any;
}

interface FieldErrors {
  password?: string;
  confirmPassword?: string;
}

export const AuthScreen: React.FC<AuthScreenProps> = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, signup, error, clearError } = useAuth();

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFieldErrors({});
    clearError();
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const switchTab = (login: boolean) => {
    setIsLogin(login);
    setFieldErrors({});
    clearError();
  };

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) return;

    if (!isLogin) {
      const errs: FieldErrors = {};
      if (password.length < 6) {
        errs.password = 'Password must be at least 6 characters';
      } else if (password !== confirmPassword) {
        errs.confirmPassword = 'Passwords do not match';
      }
      if (Object.keys(errs).length > 0) {
        setFieldErrors(errs);
        return;
      }
    }

    setFieldErrors({});
    setIsSubmitting(true);
    try {
      if (isLogin) {
        await login(email.trim(), password);
      } else {
        await signup(email.trim(), password);
      }
      setShowModal(false);
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.flex}>
      <TerrainBackground>
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={openModal}
            activeOpacity={0.7}
          >
            <Text style={styles.loginBtnText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.centerContent}>
            <Text style={styles.title}>SOMEDAY</Text>
            <View style={styles.titleAccent} />
            <Text style={styles.subtitle}>Async World-Building Game</Text>
          </View>
        </View>
      </TerrainBackground>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.backdrop} onPress={closeModal}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalCenter}
          >
            <Pressable style={styles.modal} onPress={() => {}}>
              <View style={styles.tabRow}>
                <TouchableOpacity
                  style={[styles.tab, isLogin && styles.tabActive]}
                  onPress={() => switchTab(true)}
                >
                  <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>
                    Log In
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, !isLogin && styles.tabActive]}
                  onPress={() => switchTab(false)}
                >
                  <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.form}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor="#6b7280"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={[styles.input, fieldErrors.password && styles.inputError]}
                  value={password}
                  onChangeText={(v) => {
                    setPassword(v);
                    if (fieldErrors.password) setFieldErrors(e => ({ ...e, password: undefined }));
                  }}
                  placeholder="Password"
                  placeholderTextColor="#6b7280"
                  secureTextEntry
                  autoComplete={isLogin ? 'password' : 'new-password'}
                />
                {fieldErrors.password ? (
                  <Text style={styles.fieldError}>{fieldErrors.password}</Text>
                ) : null}

                {!isLogin && (
                  <>
                    <Text style={styles.label}>Confirm Password</Text>
                    <TextInput
                      style={[styles.input, fieldErrors.confirmPassword && styles.inputError]}
                      value={confirmPassword}
                      onChangeText={(v) => {
                        setConfirmPassword(v);
                        if (fieldErrors.confirmPassword) setFieldErrors(e => ({ ...e, confirmPassword: undefined }));
                      }}
                      placeholder="Confirm password"
                      placeholderTextColor="#6b7280"
                      secureTextEntry
                    />
                    {fieldErrors.confirmPassword ? (
                      <Text style={styles.fieldError}>{fieldErrors.confirmPassword}</Text>
                    ) : null}
                  </>
                )}

                {error ? <Text style={styles.serverError}>{error}</Text> : null}

                <TouchableOpacity
                  style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                  role="button"
                  accessibilityLabel={isLogin ? 'Log In' : 'Create Account'}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitBtnText}>
                      {isLogin ? 'Log In' : 'Create Account'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
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
  loginBtn: {
    position: 'absolute',
    top: 60,
    right: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#e94560',
    zIndex: 10,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 64,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 16,
    textShadowColor: 'rgba(233, 69, 96, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 40,
  },
  titleAccent: {
    width: 80,
    height: 3,
    backgroundColor: '#e94560',
    borderRadius: 2,
    marginTop: 20,
    opacity: 0.7,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 6,
    textTransform: 'uppercase',
    marginTop: 16,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCenter: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    width: 360,
    maxWidth: '90%',
    backgroundColor: '#141428',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(233,69,96,0.2)',
    overflow: 'hidden',
  },
  tabRow: {
    flexDirection: 'row',
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
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    letterSpacing: 1,
  },
  tabTextActive: {
    color: '#fff',
  },
  form: {
    padding: 24,
  },
  label: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: '#f1f5f9',
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
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
    backgroundColor: 'rgba(233,69,96,0.1)',
    borderRadius: 8,
    padding: 10,
  },
  submitBtn: {
    backgroundColor: '#e94560',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
