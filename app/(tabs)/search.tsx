import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Search as SearchIcon, X, Filter, ChevronDown, ChevronUp } from 'lucide-react-native';
import Header from '@/components/Header';
import SnippetCard from '@/components/SnippetCard';
import CategoryPill from '@/components/CategoryPill';
import { useApp } from '@/context/AppContext';
import Categories from '@/constants/Categories';
import Colors from '@/constants/Colors';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'usage'>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const { searchSnippets, snippets } = useApp();
  
  const searchResults = searchQuery.trim() 
    ? searchSnippets(searchQuery, selectedCategory, sortBy) 
    : [];
  const showResults = searchQuery.trim().length > 0;
  
  // Popular snippets for suggestions when not searching
  const popularSnippets = snippets
    .filter(s => s.usageCount > 0)
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 5);

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };
  
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
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={18} color={Colors.textTertiary} style={styles.clearIcon} />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Filter Toggle */}
        <TouchableOpacity 
          style={styles.filterToggle}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} color={Colors.primary} />
          <Text style={styles.filterToggleText}>Filters</Text>
          {showFilters ? (
            <ChevronUp size={16} color={Colors.primary} />
          ) : (
            <ChevronDown size={16} color={Colors.primary} />
          )}
        </TouchableOpacity>
        
        {/* Filters Panel */}
        {showFilters && (
          <View style={styles.filtersPanel}>
            {/* Category Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Category</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.categoryFilters}
              >
                <TouchableOpacity
                  style={[
                    styles.categoryFilterButton,
                    !selectedCategory && styles.categoryFilterButtonActive
                  ]}
                  onPress={() => setSelectedCategory(null)}
                >
                  <Text style={[
                    styles.categoryFilterText,
                    !selectedCategory && styles.categoryFilterTextActive
                  ]}>All</Text>
                </TouchableOpacity>
                {Categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryFilterButton,
                      selectedCategory === category.id && styles.categoryFilterButtonActive
                    ]}
                    onPress={() => handleCategoryFilter(category.id)}
                  >
                    <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                    <Text style={[
                      styles.categoryFilterText,
                      selectedCategory === category.id && styles.categoryFilterTextActive
                    ]}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            {/* Sort Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Sort by</Text>
              <View style={styles.sortButtons}>
                {[
                  { key: 'relevance', label: 'Relevance' },
                  { key: 'date', label: 'Date Modified' },
                  { key: 'usage', label: 'Most Used' }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.sortButton,
                      sortBy === option.key && styles.sortButtonActive
                    ]}
                    onPress={() => setSortBy(option.key as any)}
                  >
                    <Text style={[
                      styles.sortButtonText,
                      sortBy === option.key && styles.sortButtonTextActive
                    ]}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}
      </View>
      
      {showResults ? (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsCount}>
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
          </Text>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <SnippetCard snippet={item} />}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No snippets found for "{searchQuery}"</Text>
                {selectedCategory && (
                  <Text style={styles.emptyStateSubtext}>
                    Try removing the category filter or searching in all categories
                  </Text>
                )}
              </View>
            }
          />
        </View>
      ) : (
        <View style={styles.initialState}>
          <SearchIcon size={64} color={Colors.textTertiary} style={styles.initialStateIcon} />
          <Text style={styles.initialStateText}>
            Search for snippets by title or content
          </Text>
          
          {/* Search Suggestions */}
          {popularSnippets.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>Popular Snippets</Text>
              {popularSnippets.map((snippet) => (
                <SnippetCard key={snippet.id} snippet={snippet} showPreview={false} />
              ))}
            </View>
          )}
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
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.card,
    borderRadius: 8,
    marginTop: 8,
  },
  filterToggleText: {
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 6,
    marginRight: 6,
    fontWeight: '500',
  },
  filtersPanel: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  categoryFilters: {
    flexDirection: 'row',
  },
  categoryFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.background,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  categoryFilterButtonActive: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  categoryFilterText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  categoryFilterTextActive: {
    color: Colors.primary,
  },
  sortButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.background,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  sortButtonActive: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary,
  },
  sortButtonText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: Colors.primary,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsCount: {
    fontSize: 14,
    color: Colors.textSecondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontWeight: '500',
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
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
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
  suggestionsContainer: {
    width: '100%',
    marginTop: 32,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
});