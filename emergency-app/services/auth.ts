import type { AuthResponse, User } from '../types';
import api, { handleApiError, setAuthToken } from './api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  phone?: string;
  email: string;
  password: string;
}

export interface OAuthPayload {
  token: string;
  organizationId?: string;
}

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  try {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
  try {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const googleOAuth = async (payload: OAuthPayload): Promise<AuthResponse> => {
  try {
    const { data } = await api.post<AuthResponse>('/auth/oauth/google', payload);
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const facebookOAuth = async (payload: OAuthPayload): Promise<AuthResponse> => {
  try {
    const { data } = await api.post<AuthResponse>('/auth/oauth/facebook', payload);
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchProfile = async (): Promise<User> => {
  try {
    const { data } = await api.get<User>('/auth/profile');
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const clearAuthToken = () => {
  setAuthToken(null);
};

