import { useEffect, useMemo, useState } from 'react';
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { HospitalCard } from '../../components/HospitalCard';
import { colors, radii, spacing } from '../../constants/theme';
import { fetchLongdoHospitals, fetchNearbyHospitals } from '../../services/api';
import type { Hospital, LongdoPoi } from '../../types';
import { useLocation } from '../../hooks/useLocation';

const HospitalsScreen = () => {
  const { coords, refresh, isLoading } = useLocation();

  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [longdoPois, setLongdoPois] = useState<LongdoPoi[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!coords) return;
    const fetchData = async () => {
      setIsFetching(true);
      try {
        const [backendHospitals, poi] = await Promise.all([
          fetchNearbyHospitals(coords.latitude, coords.longitude, 15),
          fetchLongdoHospitals(coords.latitude, coords.longitude),
        ]);
        setHospitals(backendHospitals);
        setLongdoPois(poi);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [coords]);

  const region = useMemo(() => {
    if (!coords) return undefined;
    return {
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  }, [coords]);

  const openMap = (lat: number, lng: number, label: string) => {
    const fallback = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    const url =
      Platform.select({
        ios: `http://maps.apple.com/?q=${encodeURIComponent(label)}&ll=${lat},${lng}`,
        android: `geo:${lat},${lng}?q=${encodeURIComponent(label)}`,
        default: fallback,
      }) ?? fallback;
    Linking.openURL(url);
  };

  const renderMap = () => {
    if (!region) {
      return <Text style={styles.helper}>กำลังดึงตำแหน่ง...</Text>;
    }
    return (
      <MapView style={styles.map} region={region} showsUserLocation>
        {hospitals.map((hospital) => (
          <Marker
            key={hospital.id}
            coordinate={{
              latitude: hospital.location.coordinates[1],
              longitude: hospital.location.coordinates[0],
            }}
            title={hospital.name}
            description={hospital.address}
          />
        ))}
        {longdoPois.map((poi) => (
          <Marker
            key={poi.id}
            coordinate={{ latitude: poi.lat, longitude: poi.lon }}
            title={poi.name}
            pinColor="#a855f7"
          />
        ))}
      </MapView>
    );
  };

  const renderList = () => (
    <ScrollView contentContainerStyle={{ gap: spacing.md }}>
      {hospitals.map((hospital) => (
        <HospitalCard
          key={hospital.id}
          payload={hospital}
          distanceKm={(hospital.distance ?? 0) / 1000}
          onNavigate={(lat, lng) => openMap(lat, lng, hospital.name)}
        />
      ))}

      {longdoPois.map((poi) => (
        <View key={poi.id} style={styles.poiCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.poiName}>{poi.name}</Text>
            {poi.distance && <Text style={styles.poiDistance}>{(poi.distance / 1000).toFixed(1)} กม.</Text>}
          </View>
          <Text style={styles.poiAddress}>{poi.address}</Text>
          <View style={styles.poiActions}>
            {poi.tel && (
              <Pressable style={[styles.poiButton, styles.outline]} onPress={() => Linking.openURL(`tel:${poi.tel}`)}>
                <MaterialCommunityIcons name="phone" color="#fff" size={18} />
                <Text style={styles.poiButtonText}>โทร</Text>
              </Pressable>
            )}
            <Pressable
              style={[styles.poiButton, styles.filled]}
              onPress={() => openMap(poi.lat, poi.lon, poi.name)}
            >
              <MaterialCommunityIcons name="navigation" color="#fff" size={18} />
              <Text style={styles.poiButtonText}>นำทาง</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.title}>โรงพยาบาลใกล้ฉัน</Text>
        <Pressable style={styles.refreshBtn} onPress={refresh}>
          <MaterialCommunityIcons name="crosshairs-gps" color="#fff" size={18} />
          <Text style={styles.refreshText}>{isLoading ? 'กำลังรีเฟรช...' : 'รีเฟรชตำแหน่ง'}</Text>
        </Pressable>
      </View>

      <View style={styles.toggleGroup}>
        <Pressable
          style={[styles.toggle, viewMode === 'map' && styles.toggleActive]}
          onPress={() => setViewMode('map')}
        >
          <Text style={styles.toggleText}>แผนที่</Text>
        </Pressable>
        <Pressable
          style={[styles.toggle, viewMode === 'list' && styles.toggleActive]}
          onPress={() => setViewMode('list')}
        >
          <Text style={styles.toggleText}>รายชื่อ</Text>
        </Pressable>
      </View>

      {isFetching ? <Text style={styles.helper}>กำลังโหลดข้อมูล...</Text> : viewMode === 'map' ? renderMap() : renderList()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    padding: spacing.lg,
    gap: spacing.md,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  refreshBtn: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceDark,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.md,
    gap: spacing.xs,
    alignItems: 'center',
  },
  refreshText: {
    color: '#fff',
    fontWeight: '600',
  },
  toggleGroup: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceDark,
    borderRadius: radii.md,
    padding: 4,
  },
  toggle: {
    flex: 1,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    color: '#fff',
    fontWeight: '600',
  },
  helper: {
    color: colors.muted,
    textAlign: 'center',
  },
  map: {
    flex: 1,
    minHeight: 360,
    borderRadius: radii.md,
  },
  poiCard: {
    backgroundColor: colors.surfaceDark,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  poiName: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  poiDistance: {
    color: colors.accentBlue,
    fontWeight: '600',
  },
  poiAddress: {
    color: colors.muted,
    fontSize: 14,
  },
  poiActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  poiButton: {
    flex: 1,
    borderRadius: radii.md,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  outline: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  filled: {
    backgroundColor: colors.primary,
  },
  poiButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default HospitalsScreen;

