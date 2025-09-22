import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Plus, Crown } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showAdd?: boolean;
  showCrown?: boolean;
  onAddPress?: () => void;
  onCrownPress?: () => void;
  rightComponent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  showAdd = false,
  showCrown = false,
  onAddPress,
  onCrownPress,
  rightComponent,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <View style={styles.leftContainer}>
          {showBack && (
            <Pressable
              onPress={() => router.back()}
              hitSlop={8}
              style={styles.backButton}
            >
              <ChevronLeft size={24} color={Colors.primary} />
            </Pressable>
          )}
          <Text style={styles.title}>{title}</Text>
        </View>
        
        <View style={styles.rightContainer}>
          {rightComponent}
          
          {showCrown && (
            <Pressable
              onPress={onCrownPress}
              hitSlop={8}
              style={styles.iconButton}
            >
              <Crown size={24} color="#FFD700" />
            </Pressable>
          )}
          
          {showAdd && (
            <Pressable
              onPress={onAddPress || (() => router.push('/new-snippet'))}
              hitSlop={8}
              style={styles.iconButton}
            >
              <Plus size={24} color={Colors.primary} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  iconButton: {
    marginLeft: 8,
  },
});

export default Header;