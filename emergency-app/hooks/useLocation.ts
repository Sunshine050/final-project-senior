import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Location from 'expo-location';

type PermissionState = Location.PermissionStatus | 'undetermined';

interface UseLocationResult {
  coords: Location.LocationObjectCoords | null;
  addressLine: string;
  permissionStatus: PermissionState;
  isLoading: boolean;
  errorMessage: string | null;
  lastUpdated: number | null;
  refresh: () => Promise<void>;
}

const buildAddress = (result?: Location.LocationGeocodedAddress) => {
  if (!result) return '';
  const segments = [
    result.name,
    result.street,
    result.subregion,
    result.city,
    result.postalCode,
  ].filter(Boolean);
  return segments.join(' ');
};

export const useLocation = (): UseLocationResult => {
  const [coords, setCoords] = useState<Location.LocationObjectCoords | null>(null);
  const [address, setAddress] = useState('');
  const [permissionStatus, setPermissionStatus] = useState<PermissionState>('undetermined');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const resolvePosition = useCallback(async () => {
    const latest = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    setCoords(latest.coords);
    setLastUpdated(Date.now());

    try {
      const [geocode] = await Location.reverseGeocodeAsync({
        latitude: latest.coords.latitude,
        longitude: latest.coords.longitude,
      });
      setAddress(buildAddress(geocode));
    } catch (error) {
      console.warn('Reverse geocode failed', error);
    }
  }, []);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const permission = await Location.getForegroundPermissionsAsync();
      let status = permission.status;

      if (status !== 'granted') {
        const requested = await Location.requestForegroundPermissionsAsync();
        status = requested.status;
      }

      setPermissionStatus(status);

      if (status === 'granted') {
        await resolvePosition();
      } else {
        setErrorMessage('โปรดอนุญาตให้เข้าถึงตำแหน่งเพื่อใช้งาน SOS');
      }
    } catch (error) {
      setErrorMessage('ไม่สามารถดึงตำแหน่งได้');
      console.warn(error);
    } finally {
      setIsLoading(false);
    }
  }, [resolvePosition]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addressLine = useMemo(() => {
    if (address) return address;
    if (!coords) return '';
    return `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
  }, [address, coords]);

  return { coords, addressLine, permissionStatus, isLoading, errorMessage, lastUpdated, refresh };
};

