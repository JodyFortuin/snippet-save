import React from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Header from '@/components/Header';
import SnippetCard from '@/components/SnippetCard';
import { useApp } from '@/context/AppContext';
import Categories from '@/constants/Categories';
import Colors from '@/constants/Colors';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getSnippetsByCategory } = useApp();
  
  const category = Categories.find(c => c.id === id);
  const snippets = getSnippetsByCategory(id);
  
  if (!category) {
    return (
      <View style={styles.container}>
        <Header title="Category Not Found" showBack />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>This category could not be found.</Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Header
        title={category.name}
        showBack
        showAdd
      />
      
      <FlatList
        data={snippets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SnippetCard snippet={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No snippets in this category yet. Create one by tapping the + button.
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