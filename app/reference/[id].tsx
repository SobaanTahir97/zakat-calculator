import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ReferenceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reference</Text>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Category: {id}</Text>
        <Text style={styles.placeholderSubText}>
          Quran reference and Hadith will be displayed here.
        </Text>
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
  placeholder: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  placeholderSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
