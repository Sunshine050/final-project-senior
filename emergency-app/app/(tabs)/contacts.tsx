import { useEffect, useState } from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { colors, radii, spacing } from "../../constants/theme";
import { quickContacts } from "../../constants/emergencyTypes";
import { getEmergencyContacts } from "../../services/api";
import type { Organization } from "../../types";

const ContactsScreen = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  useEffect(() => {
    getEmergencyContacts()
      .then(setOrganizations)
      .catch((error) => console.warn("Cannot load contacts", error));
  }, []);

  const callNumber = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>ติดต่อฉุกเฉิน</Text>
      <Text style={styles.subtitle}>แตะเพื่อโทรออกด้วยหมายเลขด่วน</Text>

      <View style={styles.quickGrid}>
        {quickContacts.map((contact) => (
          <Pressable
            key={contact.id}
            style={[styles.quickCard, { backgroundColor: contact.background }]}
            onPress={() => callNumber(contact.number)}
          >
            <MaterialCommunityIcons
              name={contact.icon as never}
              size={28}
              color="#fff"
            />
            <Text style={styles.quickLabel}>{contact.label}</Text>
            <Text style={styles.quickNumber}>{contact.number}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.title, { marginTop: spacing.lg }]}>
        หน่วยงานที่ร่วมมือ
      </Text>
      <Text style={styles.subtitle}>มูลนิธิ องค์กรกู้ภัย และศูนย์สั่งการ</Text>

      {organizations.map((org) => (
        <View key={org.id} style={styles.orgCard}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.orgName}>{org.name}</Text>
            <Text style={styles.orgType}>{org.type}</Text>
          </View>
          <Text style={styles.orgAddress}>{org.address}</Text>
          {org.phone && (
            <Pressable
              style={styles.callBtn}
              onPress={() => callNumber(org.phone)}
            >
              <MaterialCommunityIcons name="phone" color="#fff" size={18} />
              <Text style={styles.callText}>{org.phone}</Text>
            </Pressable>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundDark,
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.muted,
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginTop: spacing.md,
  },
  quickCard: {
    flexBasis: "47%",
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  quickLabel: {
    color: "#fff",
    fontWeight: "600",
  },
  quickNumber: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  orgCard: {
    backgroundColor: colors.surfaceDark,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  orgName: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  orgType: {
    color: colors.accentBlue,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  orgAddress: {
    color: colors.muted,
    fontSize: 14,
  },
  callBtn: {
    flexDirection: "row",
    gap: spacing.xs,
    backgroundColor: colors.primary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    alignSelf: "flex-start",
  },
  callText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default ContactsScreen;
