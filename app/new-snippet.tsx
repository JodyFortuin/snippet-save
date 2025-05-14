import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import Header from '@/components/Header';
import CategoryPill from '@/components/CategoryPill';
import { useApp } from '@/context/AppContext';
import Categories from '@/constants/Categories';
import Colors from '@/constants/Colors';

export default function NewSnippetScreen() {
  const { addSnippet } = useApp();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(Categories[0].id);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const handleCreate = () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a title for your snippet.');
      return;
    }
    
    if (!content.trim()) {
      Alert.alert('Missing Content', 'Please enter content for your snippet.');
      return;
    }
    
    addSnippet({
      title: title.trim(),
      content: content.trim(),
      categoryId: selectedCategoryId,
      isFavorite,
    });
    
    Alert.alert(
      'Snippet Created',
      'Your snippet has been created successfully.',
      [
        { text: 'OK', onPress: () => router.back() }
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <Header
        title="New Snippet"
        showBack
        rightComponent={
          <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
        }
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="Enter a title"
              value={title}
              onChangeText={setTitle}
              maxLength={50}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Content</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="Enter your text"
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={10}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.categoriesContainer}
              contentContainerStyle={styles.categoriesContent}
            >
              {Categories.map((category) => (
                <CategoryPill
                  key={category.id}
                  category={category}
                  isSelected={selectedCategoryId === category.id}
                  onPress={() => setSelectedCategoryId(category.id)}
                />
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.favoriteContainer}>
            <Text style={styles.label}>Add to Favorites</Text>
            <TouchableOpacity
              style={[
                styles.favoriteButton,
                isFavorite && styles.favoriteButtonActive
              ]}
              onPress={() => setIsFavorite(!isFavorite)}
            >
              <Text
                style={[
                  styles.favoriteButtonText,
                  isFavorite && styles.favoriteButtonTextActive
                ]}
              >
                {isFavorite ? 'Added to Favorites' : 'Add to Favorites'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    padding: 16,
    paddingBottom: 32,
  },
  createButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  form: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  titleInput: {
    height: 48,
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: Colors.text,
  },
  contentInput: {
    minHeight: 150,
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
  },
  categoriesContainer: {
    marginBottom: 8,
  },
  categoriesContent: {
    paddingRight: 32,
    paddingVertical: 8,
  },
  favoriteContainer: {
    marginBottom: 8,
  },
  favoriteButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  favoriteButtonActive: {
    backgroundColor: Colors.warning + '20',
  },
  favoriteButtonText: {
    color: Colors.warning,
    fontWeight: '500',
    fontSize: 14,
  },
  favoriteButtonTextActive: {
    color: Colors.warning,
  },
});