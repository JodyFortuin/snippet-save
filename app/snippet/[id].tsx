import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Pencil, Copy, Trash2, Check } from 'lucide-react-native';
import Header from '@/components/Header';
import CategoryPill from '@/components/CategoryPill';
import { useApp } from '@/context/AppContext';
import Categories from '@/constants/Categories';
import Colors from '@/constants/Colors';

export default function SnippetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getSnippetById, updateSnippet, deleteSnippet, copySnippet } = useApp();
  
  const snippet = getSnippetById(id);
  
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(snippet?.title || '');
  const [content, setContent] = useState(snippet?.content || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState(snippet?.categoryId || '');
  const [isFavorite, setIsFavorite] = useState(snippet?.isFavorite || false);
  const [copied, setCopied] = useState(false);
  
  if (!snippet) {
    return (
      <View style={styles.container}>
        <Header title="Snippet Not Found" showBack />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>This snippet could not be found.</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  const category = Categories.find(c => c.id === (isEditing ? selectedCategoryId : snippet.categoryId));
  
  const handleCopy = async () => {
    await Clipboard.setStringAsync(snippet.content);
    copySnippet(snippet.id);
    
    // Provide haptic feedback on iOS/Android
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Show visual feedback
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a title for your snippet.');
      return;
    }
    
    if (!content.trim()) {
      Alert.alert('Missing Content', 'Please enter content for your snippet.');
      return;
    }
    
    updateSnippet(snippet.id, {
      title: title.trim(),
      content: content.trim(),
      categoryId: selectedCategoryId,
      isFavorite,
    });
    
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Snippet',
      'Are you sure you want to delete this snippet? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteSnippet(snippet.id);
            router.back();
          } 
        },
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <Header
        title={isEditing ? 'Edit Snippet' : 'Snippet Details'}
        showBack
        rightComponent={
          isEditing ? (
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Pencil size={20} color={Colors.primary} />
            </TouchableOpacity>
          )
        }
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          {isEditing ? (
            // Edit Mode
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
              
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Trash2 size={18} color={Colors.error} style={styles.deleteIcon} />
                <Text style={styles.deleteText}>Delete Snippet</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // View Mode
            <>
              <View style={styles.header}>
                <Text style={styles.title}>{snippet.title}</Text>
                
                {category && (
                  <View style={styles.categoryContainer}>
                    <View 
                      style={[
                        styles.categoryBadge, 
                        { backgroundColor: category.color + '20' }
                      ]}
                    >
                      <View 
                        style={[
                          styles.categoryDot, 
                          { backgroundColor: category.color }
                        ]} 
                      />
                      <Text 
                        style={[
                          styles.categoryText, 
                          { color: category.color }
                        ]}
                      >
                        {category.name}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
              
              <View style={styles.contentContainer}>
                <Text style={styles.content}>{snippet.content}</Text>
              </View>
              
              <View style={styles.metaInfo}>
                <Text style={styles.metaText}>
                  Created on {new Date(snippet.dateCreated).toLocaleDateString()}
                </Text>
                <Text style={styles.metaText}>
                  Used {snippet.usageCount} {snippet.usageCount === 1 ? 'time' : 'times'}
                </Text>
                {snippet.lastUsed && (
                  <Text style={styles.metaText}>
                    Last used on {new Date(snippet.lastUsed).toLocaleDateString()}
                  </Text>
                )}
              </View>
              
              <TouchableOpacity
                style={styles.copyButton}
                onPress={handleCopy}
              >
                {copied ? (
                  <>
                    <Check size={20} color={Colors.background} />
                    <Text style={styles.copyButtonText}>Copied to Clipboard</Text>
                  </>
                ) : (
                  <>
                    <Copy size={20} color={Colors.background} />
                    <Text style={styles.copyButtonText}>Copy to Clipboard</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}
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
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  contentContainer: {
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderLight,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text,
  },
  metaInfo: {
    marginTop: 16,
    marginBottom: 16,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginBottom: 4,
  },
  copyButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyButtonText: {
    color: Colors.background,
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 8,
  },
  editButton: {
    padding: 8,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  notFoundText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  form: {
    paddingVertical: 8,
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
    marginBottom: 20,
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
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: 8,
  },
  deleteIcon: {
    marginRight: 8,
  },
  deleteText: {
    color: Colors.error,
    fontWeight: '500',
    fontSize: 14,
  },
});