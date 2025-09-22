import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Features() {
  const router = useRouter();
  const { setOnboardingComplete } = useApp();
  
  const handleContinue = async () => {
    // Mark onboarding as complete before going to paywall
    await AsyncStorage.setItem('onboarding_complete', 'true');
    setOnboardingComplete(true);
    router.replace('/paywall');
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Why SnippetSave?</Text>
      <View style={styles.featureBox}>
        <Text style={styles.featureTitle}>🔍 Fast Search</Text>
        <Text style={styles.featureDesc}>Find your code snippets instantly with smart search.</Text>
      </View>
      <View style={styles.featureBox}>
        <Text style={styles.featureTitle}>📁 Organize</Text>
        <Text style={styles.featureDesc}>Group snippets by category for easy access.</Text>
      </View>
      <View style={styles.featureBox}>
        <Text style={styles.featureTitle}>⭐ Favorites</Text>
        <Text style={styles.featureDesc}>Mark important snippets for quick reference.</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 24,
    textAlign: 'center',
  },
  featureBox: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 8,
    marginTop: 32,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 