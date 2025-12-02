import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../../hooks/useAuth';
import { useRouter } from 'expo-router';

export const useProfileController = () => {
  const { logout: authLogout } = useAuth();
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleCameraPress = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatarUrl(result.assets[0].uri);
      // TODO: Upload to backend
    }
  };

  const handleLogout = async () => {
    await authLogout();
    setLogoutModalVisible(false);
    router.replace('/(auth)/login');
  };

  return {
    avatarUrl,
    isUploading,
    logoutModalVisible,
    setLogoutModalVisible,
    handleCameraPress,
    handleLogout,
  };
};

