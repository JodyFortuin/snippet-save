import React from 'react';
import { StyleSheet, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Category } from '@/constants/Categories';

interface CategoryPillProps {
  category: Category;
  isSelected?: boolean;
  onPress?: () => void;
}

const CategoryPill: React.FC<CategoryPillProps> = ({ 
  category, 
  isSelected = false,
  onPress
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/category/${category.id}`);
    }
  };

  return (
    <Pressable 
      style={[
        styles.container, 
        { 
          backgroundColor: isSelected 
            ? category.color + '30' 
            : category.color + '10',
          borderColor: isSelected 
            ? category.color 
            : 'transparent'
        }
      ]} 
      onPress={handlePress}
    >
      <View style={[styles.dot, { backgroundColor: category.color }]} />
      <Text style={[styles.text, { color: category.color }]}>
        {category.name}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CategoryPill;