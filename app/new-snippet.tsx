import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { router } from 'expo-router';
import { Bold, Italic, Underline, Code, Link, List, Type } from 'lucide-react-native';
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
  const [isRichText, setIsRichText] = useState(false);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  
  const applyFormatting = (format: string) => {
    if (!isRichText) return;
    
    const selectedText = content.substring(selectionStart, selectionEnd);
    if (!selectedText) return;
    
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        break;
      case 'code':
        formattedText = `\`${selectedText}\``;
        break;
      case 'link':
        formattedText = `[${selectedText}](url)`;
        break;
      case 'list':
        formattedText = `• ${selectedText}`;
        break;
      default:
        return;
    }
    
    const newContent = content.substring(0, selectionStart) + formattedText + content.substring(selectionEnd);
    setContent(newContent);
  };
  
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
            
            {/* Rich Text Toggle */}
            <View style={styles.richTextToggle}>
              <Text style={styles.richTextLabel}>Rich Text</Text>
              <Switch
                value={isRichText}
                onValueChange={setIsRichText}
                trackColor={{ false: Colors.borderLight, true: Colors.primary + '80' }}
                thumbColor={isRichText ? Colors.primary : Colors.textTertiary}
              />
            </View>
            
            {/* Formatting Toolbar */}
            {isRichText && (
              <View style={styles.formattingToolbar}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <TouchableOpacity style={styles.formatButton} onPress={() => applyFormatting('bold')}>
                    <Bold size={16} color={Colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.formatButton} onPress={() => applyFormatting('italic')}>
                    <Italic size={16} color={Colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.formatButton} onPress={() => applyFormatting('underline')}>
                    <Underline size={16} color={Colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.formatButton} onPress={() => applyFormatting('code')}>
                    <Code size={16} color={Colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.formatButton} onPress={() => applyFormatting('link')}>
                    <Link size={16} color={Colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.formatButton} onPress={() => applyFormatting('list')}>
                    <List size={16} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </ScrollView>
              </View>
            )}
            
            <TextInput
              style={styles.contentInput}
              placeholder={isRichText ? "Enter your text (supports **bold**, *italic*, __underline__, `code`, [links](url), • lists)" : "Enter your text"}
              value={content}
              onChangeText={setContent}
              onSelectionChange={(event) => {
                setSelectionStart(event.nativeEvent.selection.start);
                setSelectionEnd(event.nativeEvent.selection.end);
              }}
              multiline
              numberOfLines={10}
              textAlignVertical="top"
            />
            
            {/* Rich Text Help */}
            {isRichText && (
              <Text style={styles.helpText}>
                Select text and use toolbar, or type: **bold**, *italic*, __underline__, `code`, [link](url), • list
              </Text>
            )}
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
  richTextToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  richTextLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  formattingToolbar: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  formatButton: {
    padding: 8,
    marginRight: 4,
    borderRadius: 6,
    backgroundColor: Colors.card,
  },
  helpText: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 4,
    fontStyle: 'italic',
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