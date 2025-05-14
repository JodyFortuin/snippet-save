import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showAdd?: boolean;
  onAddPress?: () => void;
  rightComponent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  showAdd = false,
  onAddPress,
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
          
          {showAdd && (
            <Pressable
              onPress={onAddPress || (() => router.push('/new-snippet'))}
              hitSlop={8}
              style={styles.addButton}
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
  addButton: {
    marginLeft: 8,
  },
});

export default Header;