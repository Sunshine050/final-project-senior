const React = require('react');
const { View, Text, StyleSheet } = require('react-native');

const MapPlaceholder = ({ style, children }) => (
  <View style={[styles.container, style]}>
    <Text style={styles.text}>แผนที่ใช้ได้เฉพาะบนมือถือ</Text>
    {children}
  </View>
);

const Marker = ({ children }) => <View>{children}</View>;

module.exports = {
  default: MapPlaceholder,
  Marker,
};

const styles = StyleSheet.create({
  container: {
    minHeight: 200,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  text: {
    color: '#e2e8f0',
    fontSize: 14,
  },
});

