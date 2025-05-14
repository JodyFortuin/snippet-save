import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList } from 'react-native';
import { Search as SearchIcon, X } from 'lucide-react-native';
import Header from '@/components/Header';
import SnippetCard from '@/components/SnippetCard';
import { useApp } from '@/context/AppContext';
import Colors from '@/constants/Colors';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { searchSnippets } = useApp();
  
  const searchResults = searchQuery.trim() ? searchSnippets(searchQuery) : [];
  const showResults = searchQuery.trim().length > 0;
  
  return (
    <View style={styles.container}>
      <Header title="Search" />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <SearchIcon size={20} color={Colors.textTertiary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search snippets..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <X
              size={18}
              color={Colors.textTertiary}
              style={styles.clearIcon}
              onPress={() => setSearchQuery('')}
            />
          )}
        </View>
      </View>
      
      {showResults ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SnippetCard snippet={item} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No snippets found for "{searchQuery}"</Text>
            </View>
          }
        />
      ) : (
        <View style={styles.initialState}>
          <SearchIcon size={64} color={Colors.textTertiary} style={styles.initialStateIcon} />
          <Text style={styles.initialStateText}>
            Search for snippets by title or content
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    borderRadius: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  clearIcon: {
    padding: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    height: 40,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 120,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  initialState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  initialStateIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  initialStateText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});