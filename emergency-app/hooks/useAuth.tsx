import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import type { AuthSessionResult } from 'expo-auth-session';

import type { User } from '../types';
import { setAuthToken } from '../services/api';
import {
  clearAuthToken,
  facebookOAuth,
  fetchProfile,
  googleOAuth,
  login,
  register,
  type LoginPayload,
  type RegisterPayload,
} from '../services/auth';

WebBrowser.maybeCompleteAuthSession();

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  status: AuthStatus;
  isSubmitting: boolean;
  loginWithEmail: (payload: LoginPayload) => Promise<void>;
  registerWithEmail: (payload: RegisterPayload) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = '@emergency/token';
const USER_KEY = '@emergency/user';

const GOOGLE_CLIENT_IDS = {
  expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
};

const FACEBOOK_APP_ID = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID;
const hasGoogleClient = Object.values(GOOGLE_CLIENT_IDS).some(Boolean);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>('checking');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const googleConfig = useMemo(() => {
    const config: any = {
      scopes: ['profile', 'email'],
      responseType: 'id_token',
      extraParams: {
        prompt: 'select_account',
      },
    };
    if (GOOGLE_CLIENT_IDS.expoClientId) config.expoClientId = GOOGLE_CLIENT_IDS.expoClientId;
    if (GOOGLE_CLIENT_IDS.iosClientId) config.iosClientId = GOOGLE_CLIENT_IDS.iosClientId;
    if (GOOGLE_CLIENT_IDS.androidClientId) config.androidClientId = GOOGLE_CLIENT_IDS.androidClientId;
    if (GOOGLE_CLIENT_IDS.webClientId) config.webClientId = GOOGLE_CLIENT_IDS.webClientId;
    return config;
  }, []);

  const [, , promptGoogleAsync] = Google.useAuthRequest(googleConfig);

  const [, , promptFacebookAsync] = Facebook.useAuthRequest({
    clientId: FACEBOOK_APP_ID ?? '',
    scopes: ['public_profile', 'email'],
    responseType: 'token',
  });

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);

        if (storedToken && storedUser) {
          setAuthToken(storedToken);
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setStatus('authenticated');
        } else {
          setStatus('unauthenticated');
        }
      } catch (error) {
        console.warn('Failed to restore auth state', error);
        setStatus('unauthenticated');
      }
    };

    bootstrap();
  }, []);

  const persistAuth = useCallback(async (accessToken: string, nextUser: User) => {
    setAuthToken(accessToken);
    setToken(accessToken);
    setUser(nextUser);
    setStatus('authenticated');
    await Promise.all([
      AsyncStorage.setItem(TOKEN_KEY, accessToken),
      AsyncStorage.setItem(USER_KEY, JSON.stringify(nextUser)),
    ]);
  }, []);

  const loginWithEmail = useCallback(
    async (payload: LoginPayload) => {
      setIsSubmitting(true);
      try {
        const response = await login(payload);
        await persistAuth(response.accessToken, response.user);
      } finally {
        setIsSubmitting(false);
      }
    },
    [persistAuth],
  );

  const registerWithEmail = useCallback(
    async (payload: RegisterPayload) => {
      setIsSubmitting(true);
      try {
        const response = await register(payload);
        await persistAuth(response.accessToken, response.user);
      } finally {
        setIsSubmitting(false);
      }
    },
    [persistAuth],
  );

  const handleOAuthResponse = useCallback(
    async (
      response: AuthSessionResult | null,
      provider: 'google' | 'facebook',
    ) => {
      if (!response) {
        throw new Error('การเข้าสู่ระบบถูกยกเลิก');
      }

      if (response.type === 'error') {
        const error = response.error || response.params?.error;
        const errorDescription = response.params?.error_description || '';
        throw new Error(
          error === 'invalid_request'
            ? 'Redirect URI ไม่ตรงกัน กรุณาตรวจสอบการตั้งค่า OAuth'
            : `เกิดข้อผิดพลาด: ${errorDescription || error}`,
        );
      }

      if (response.type !== 'success' || !response.authentication) {
        throw new Error('การเข้าสู่ระบบไม่สำเร็จ');
      }

      const tokenField = provider === 'google' ? 'idToken' : 'accessToken';
      const rawToken = response.authentication[tokenField];

      if (!rawToken) {
        throw new Error('ไม่พบโทเคนสำหรับเข้าสู่ระบบ');
      }

      const authResponse =
        provider === 'google'
          ? await googleOAuth({ token: rawToken })
          : await facebookOAuth({ token: rawToken });

      await persistAuth(authResponse.accessToken, authResponse.user);
    },
    [persistAuth],
  );

  const loginWithGoogle = useCallback(async () => {
    if (!hasGoogleClient) {
      throw new Error('ยังไม่ได้ตั้งค่า Google OAuth Client ID');
    }
    setIsSubmitting(true);
    try {
      const response = await promptGoogleAsync();
      console.log('Google OAuth response:', response.type, response);
      if (response.type === 'error') {
        console.error('OAuth error:', response.error, response.params);
      }
      await handleOAuthResponse(response, 'google');
    } catch (error) {
      console.error('Google OAuth error:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [handleOAuthResponse, promptGoogleAsync, hasGoogleClient]);

  const loginWithFacebook = useCallback(async () => {
    if (!FACEBOOK_APP_ID) {
      throw new Error('ยังไม่ได้ตั้งค่า Facebook App ID');
    }
    setIsSubmitting(true);
    try {
      const response = await promptFacebookAsync();
      await handleOAuthResponse(response, 'facebook');
    } finally {
      setIsSubmitting(false);
    }
  }, [handleOAuthResponse, promptFacebookAsync]);

  const logout = useCallback(async () => {
    setUser(null);
    setToken(null);
    setStatus('unauthenticated');
    clearAuthToken();
    await Promise.all([AsyncStorage.removeItem(TOKEN_KEY), AsyncStorage.removeItem(USER_KEY)]);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    const profile = await fetchProfile();
    setUser(profile);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(profile));
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      status,
      isSubmitting,
      loginWithEmail,
      registerWithEmail,
      loginWithGoogle,
      loginWithFacebook,
      logout,
      refreshProfile,
    }),
    [
      isSubmitting,
      loginWithEmail,
      loginWithFacebook,
      loginWithGoogle,
      logout,
      refreshProfile,
      registerWithEmail,
      status,
      token,
      user,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

