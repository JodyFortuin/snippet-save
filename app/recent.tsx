import React from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import Header from '@/components/Header';
import SnippetCard from '@/components/SnippetCard';
import { useApp } from '@/context/AppContext';
import Colors from '@/constants/Colors';

export default function RecentScreen() {
  const { getRecentCopied } = useApp();
  const recentSnippets = getRecentCopied(20); // Show up to 20 recently used snippets
  
  return (
    <View style={styles.container}>
      <Header title="Recently Used" showBack showAdd />
      
      <FlatList
        data={recentSnippets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SnippetCard snippet={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Your recently used snippets will appear here.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 64,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});