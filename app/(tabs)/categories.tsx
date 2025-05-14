import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Folder, Plus, X, Check, Edit2, Trash2 } from 'lucide-react-native';
import Header from '@/components/Header';
import { useApp } from '@/context/AppContext';
import Colors from '@/constants/Colors';

export default function CategoriesScreen() {
  const { categories, getSnippetsByCategory, addCategory, updateCategory, deleteCategory } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryColor, setCategoryColor] = useState('#007AFF');
  
  const colors = [
    '#007AFF', // Blue
    '#34C759', // Green
    '#FF9500', // Orange
    '#FF2D55', // Pink
    '#5856D6', // Purple
    '#5AC8FA', // Light Blue
    '#FF3B30', // Red
    '#FFCC00', // Yellow
    '#8E8E93', // Gray
  ];

  const handleSaveCategory = () => {
    if (!categoryName.trim()) return;

    if (editingCategory) {
      updateCategory(editingCategory, {
        name: categoryName.trim(),
        color: categoryColor,
      });
    } else if (newCategory) {
      addCategory({
        name: categoryName.trim(),
        color: categoryColor,
      });
    }

    // Reset state
    setEditingCategory(null);
    setNewCategory(false);
    setCategoryName('');
    setCategoryColor('#007AFF');
    setIsEditing(false);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const snippets = getSnippetsByCategory(categoryId);
    if (snippets.length > 0) {
      alert(`Cannot delete category with ${snippets.length} snippets. Move or delete the snippets first.`);
      return;
    }
    deleteCategory(categoryId);
  };

  const startEditing = (category: { id: string; name: string; color: string }) => {
    setEditingCategory(category.id);
    setCategoryName(category.name);
    setCategoryColor(category.color);
    setIsEditing(true);
    setNewCategory(false);
  };

  const startNewCategory = () => {
    setNewCategory(true);
    setEditingCategory(null);
    setCategoryName('');
    setCategoryColor('#007AFF');
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditingCategory(null);
    setNewCategory(false);
    setCategoryName('');
    setCategoryColor('#007AFF');
  };
  
  return (
    <View style={styles.container}>
      <Header 
        title="Categories" 
        rightComponent={
          !isEditing ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Edit2 size={20} color={Colors.primary} />
            </TouchableOpacity>
          ) : null
        }
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((category) => {
          const snippetsInCategory = getSnippetsByCategory(category.id);
          const count = snippetsInCategory.length;
          const isEditing = editingCategory === category.id;
          
          if (isEditing) {
            return (
              <View key={category.id} style={styles.editContainer}>
                <TextInput
                  style={styles.nameInput}
                  value={categoryName}
                  onChangeText={setCategoryName}
                  placeholder="Category name"
                  maxLength={20}
                />
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.colorPicker}
                >
                  {colors.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        categoryColor === color && styles.colorOptionSelected,
                      ]}
                      onPress={() => setCategoryColor(color)}
                    />
                  ))}
                </ScrollView>
                <View style={styles.editActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={cancelEditing}
                  >
                    <X size={20} color={Colors.error} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.saveButton]}
                    onPress={handleSaveCategory}
                  >
                    <Check size={20} color={Colors.success} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }
          
          return (
            <Pressable
              key={category.id}
              style={styles.categoryCard}
              onPress={() => router.push(`/category/${category.id}`)}
            >
              <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
                <Folder size={24} color={category.color} />
              </View>
              
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.snippetCount}>
                  {count} {count === 1 ? 'snippet' : 'snippets'}
                </Text>
              </View>
              
              {isEditing && (
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => startEditing(category)}
                  >
                    <Edit2 size={18} color={Colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 size={18} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              )}
              
              {!isEditing && (
                <View style={[styles.countBadge, { backgroundColor: category.color }]}>
                  <Text style={styles.countText}>{count}</Text>
                </View>
              )}
            </Pressable>
          );
        })}

        {/* Add New Category Button */}
        {isEditing && !editingCategory && !newCategory && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={startNewCategory}
          >
            <Plus size={24} color={Colors.primary} />
            <Text style={styles.addButtonText}>Add New Category</Text>
          </TouchableOpacity>
        )}

        {/* New Category Form */}
        {newCategory && (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.nameInput}
              value={categoryName}
              onChangeText={setCategoryName}
              placeholder="Category name"
              maxLength={20}
            />
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.colorPicker}
            >
              {colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    categoryColor === color && styles.colorOptionSelected,
                  ]}
                  onPress={() => setCategoryColor(color)}
                />
              ))}
            </ScrollView>
            <View style={styles.editActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={cancelEditing}
              >
                <X size={20} color={Colors.error} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.saveButton]}
                onPress={handleSaveCategory}
              >
                <Check size={20} color={Colors.success} />
              </TouchableOpacity>
            </View>
          </View>
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
    padding: 16,
    paddingBottom: 100,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  snippetCount: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  countBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  countText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  editButton: {
    padding: 8,
  },
  editContainer: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  nameInput: {
    fontSize: 16,
    padding: 12,
    backgroundColor: Colors.background,
    borderRadius: 8,
    marginBottom: 12,
  },
  colorPicker: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: Colors.error + '20',
  },
  saveButton: {
    backgroundColor: Colors.success + '20',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary + '30',
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
    marginLeft: 8,
  },
});