import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import Header from '@/components/Header';
import SnippetCard from '@/components/SnippetCard';
import CategoryPill from '@/components/CategoryPill';
import { useApp } from '@/context/AppContext';
import { useSubscription } from '@/context/SubscriptionContext';
import Categories from '@/constants/Categories';
import Colors from '@/constants/Colors';

export default function HomeScreen() {
  const { getFavorites, getRecentCopied, snippets } = useApp();
  const { isInTrial } = useSubscription();
  
  const favorites = getFavorites();
  const recentlyUsed = getRecentCopied();

  return (
    <View style={styles.container}>
      <Header 
        title="SnipSave" 
        showAdd
        showCrown={!isInTrial}
        onCrownPress={() => router.push('/paywall')}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}
          >
            {Categories.map((category) => (
              <CategoryPill key={category.id} category={category} />
            ))}
          </ScrollView>
        </View>

        {/* Favorites */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Favorites</Text>
            {favorites.length > 0 && (
              <Pressable onPress={() => router.push('/favorites')}>
                <Text style={styles.seeAllText}>See all</Text>
              </Pressable>
            )}
          </View>
          
          {favorites.length > 0 ? (
            favorites.slice(0, 3).map((snippet) => (
              <SnippetCard key={snippet.id} snippet={snippet} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No favorites yet. Star your important snippets to see them here.
              </Text>
            </View>
          )}
        </View>

        {/* Recently Used */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Used</Text>
            {recentlyUsed.length > 0 && (
              <Pressable onPress={() => router.push('/recent')}>
                <Text style={styles.seeAllText}>See all</Text>
              </Pressable>
            )}
          </View>
          
          {recentlyUsed.length > 0 ? (
            recentlyUsed.slice(0, 3).map((snippet) => (
              <SnippetCard key={snippet.id} snippet={snippet} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Your recently used snippets will appear here.
              </Text>
            </View>
          )}
        </View>

        {/* Create New Button (for empty state) */}
        {snippets.length === 0 && (
          <Pressable
            style={styles.createNewButton}
            onPress={() => router.push('/new-snippet')}
          >
            <Plus size={24} color={Colors.background} />
            <Text style={styles.createNewText}>Create Your First Snippet</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  categoriesContainer: {
    marginBottom: 8,
  },
  categoriesContent: {
    paddingRight: 32,
  },
  emptyState: {
    padding: 24,
    backgroundColor: Colors.card,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  createNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  createNewText: {
    color: Colors.background,
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});