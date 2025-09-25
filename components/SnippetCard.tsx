import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import { router } from 'expo-router';
import { Star, Copy, MoveVertical as MoreVertical, Check } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Snippet } from '@/types';
import { useApp } from '@/context/AppContext';
import Categories from '@/constants/Categories';
import Colors from '@/constants/Colors';

interface SnippetCardProps {
  snippet: Snippet;
  showPreview?: boolean;
}

const SnippetCard: React.FC<SnippetCardProps> = ({ snippet, showPreview = true }) => {
  const { toggleFavorite, copySnippet } = useApp();
  const [copied, setCopied] = useState(false);

  const category = Categories.find(c => c.id === snippet.categoryId);

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

  const handleCardPress = () => {
    router.push(`/snippet/${snippet.id}`);
  };

  const truncateContent = (content: string, maxLength = 100) => {
    // Remove markdown formatting for preview
    let cleanContent = content
      .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
      .replace(/\*(.*?)\*/g, '$1')     // Italic
      .replace(/__(.*?)__/g, '$1')     // Underline
      .replace(/`(.*?)`/g, '$1')       // Code
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // Links
      .replace(/^• /gm, '');           // List bullets
    
    if (cleanContent.length <= maxLength) return cleanContent;
    return cleanContent.substring(0, maxLength) + '...';
  };

  return (
    <Pressable
      style={styles.container}
      onPress={handleCardPress}
      android_ripple={{ color: 'rgba(0, 0, 0, 0.05)' }}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{snippet.title}</Text>
          <Pressable
            onPress={() => toggleFavorite(snippet.id)}
            style={styles.iconButton}
            hitSlop={10}
          >
            <Star
              size={18}
              color={snippet.isFavorite ? Colors.warning : Colors.textTertiary}
              fill={snippet.isFavorite ? Colors.warning : 'transparent'}
            />
          </Pressable>
        </View>
        
        <View style={styles.categoryContainer}>
          <View 
            style={[
              styles.categoryBadge, 
              { backgroundColor: category ? category.color + '20' : Colors.textTertiary + '20' }
            ]}
          >
            <View 
              style={[
                styles.categoryDot, 
                { backgroundColor: category ? category.color : Colors.textTertiary }
              ]} 
            />
            <Text 
              style={[
                styles.categoryText, 
                { color: category ? category.color : Colors.textTertiary }
              ]}
            >
              {category ? category.name : 'Uncategorized'}
            </Text>
          </View>
        </View>
      </View>

      {showPreview && (
        <View style={styles.content}>
          <Text style={styles.contentText}>
            {truncateContent(snippet.content)}
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.usageText}>
          Used {snippet.usageCount} {snippet.usageCount === 1 ? 'time' : 'times'}
        </Text>
        
        <View style={styles.actions}>
          <Pressable
            onPress={handleCopy}
            style={styles.copyButton}
            hitSlop={10}
          >
            {copied ? (
              <Check size={20} color={Colors.success} />
            ) : (
              <Copy size={20} color={Colors.primary} />
            )}
          </Pressable>
          
          <Pressable
            onPress={handleCardPress}
            style={styles.moreButton}
            hitSlop={10}
          >
            <MoreVertical size={20} color={Colors.textTertiary} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  iconButton: {
    padding: 4,
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
  content: {
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.borderLight,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  footer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  usageText: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyButton: {
    padding: 6,
    marginRight: 8,
  },
  moreButton: {
    padding: 6,
  },
});

export default SnippetCard;