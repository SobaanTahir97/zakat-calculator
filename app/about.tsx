import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>About This App</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Disclaimer</Text>
        <Text style={styles.sectionText}>
          This app is a calculation tool only and does not constitute a religious
          ruling (fatwa). Zakat obligations may vary based on individual
          circumstances and scholarly interpretation. We recommend consulting a
          qualified Islamic scholar for personal guidance.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sources</Text>
        <Text style={styles.sectionText}>
          The developers have made every effort to use authentic, widely-accepted
          sources (Quran and Sahih Hadith), but cannot guarantee completeness.
          Use at your own discretion.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Version</Text>
        <Text style={styles.sectionText}>v1.0.0 • MVP Edition</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
});
