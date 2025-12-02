import api from '../../../services/api';

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
  medicalInfo?: {
    bloodType?: string;
    allergies?: string;
  };
  emergencyContact?: {
    name?: string;
    phone?: string;
  };
  profileSettings?: {
    displayName?: string;
  };
}

export interface UpdateUserProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  medicalInfo?: {
    bloodType?: string;
    allergies?: string;
  };
  emergencyContact?: {
    name?: string;
    phone?: string;
  };
}

export const getUserMeApi = async (): Promise<UserProfile> => {
  const { data } = await api.get<UserProfile>('/auth/profile');
  return data;
};

export const updateUserProfile = async (
  userId: string,
  payload: UpdateUserProfilePayload
): Promise<UserProfile> => {
  const { data } = await api.patch<UserProfile>(`/users/${userId}`, payload);
  return data;
};

