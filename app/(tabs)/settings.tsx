import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Switch, Alert, Linking } from 'react-native';
import { 
  Moon, 
  Info, 
  Mail, 
  Share2, 
  ChevronRight, 
  Shield 
} from 'lucide-react-native';
import Header from '@/components/Header';
import Colors from '@/constants/Colors';

export default function SettingsScreen() {
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

  const handleExport = () => {
    Alert.alert('Coming Soon', 'Export functionality will be available in the next update.');
  };

  const sendFeedback = () => {
    Linking.openURL('mailto:jody606@icloud.com?subject=Snippet%20Save%20Feedback');
  };

  return (
    <View style={styles.container}>
      <Header title="Settings" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Preferences section commented out
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#8E8E9320' }]}>
                <Moon size={20} color={Colors.textSecondary} />
              </View>
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: '#D1D1D6', true: Colors.primary + '80' }}
              thumbColor={darkModeEnabled ? Colors.primary : '#FFFFFF'}
              ios_backgroundColor="#D1D1D6"
            />
          </View>
        </View>
        */}
        
        {/* Data section commented out
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          
          <Pressable style={styles.settingItem} onPress={handleExport}>
            <View style={styles.settingItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: Colors.primary + '20' }]}>
                <Share2 size={20} color={Colors.primary} />
              </View>
              <Text style={styles.settingLabel}>Export Data</Text>
            </View>
            <ChevronRight size={18} color={Colors.textTertiary} />
          </Pressable>
        </View>
        */}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <Pressable style={styles.settingItem} onPress={() => Linking.openURL('https://holoscale.digital')}>
            <View style={styles.settingItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: Colors.success + '20' }]}>
                <Shield size={20} color={Colors.success} />
              </View>
              <Text style={styles.settingLabel}>Privacy Policy</Text>
            </View>
            <ChevronRight size={18} color={Colors.textTertiary} />
          </Pressable>
          
          {/* About SnipSave button commented out
          <Pressable style={styles.settingItem} onPress={() => {}}>
            <View style={styles.settingItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#8E8E9320' }]}>
                <Info size={20} color={Colors.textSecondary} />
              </View>
              <Text style={styles.settingLabel}>About SnipSave</Text>
            </View>
            <ChevronRight size={18} color={Colors.textTertiary} />
          </Pressable>
          */}
          
          <Pressable style={styles.settingItem} onPress={sendFeedback}>
            <View style={styles.settingItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#8E8E9320' }]}>
                <Mail size={20} color={Colors.textSecondary} />
              </View>
              <Text style={styles.settingLabel}>Send Feedback</Text>
            </View>
            <ChevronRight size={18} color={Colors.textTertiary} />
          </Pressable>
          
          {/* GitHub Repository button commented out
          <Pressable style={styles.settingItem} onPress={() => {}}>
            <View style={styles.settingItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#8E8E9320' }]}>
                <Github size={20} color={Colors.textSecondary} />
              </View>
              <Text style={styles.settingLabel}>GitHub Repository</Text>
            </View>
            <ChevronRight size={18} color={Colors.textTertiary} />
          </Pressable>
          */}
        </View>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>SnipSave v1.0.0</Text>
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
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  versionContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: Colors.textTertiary,
  },
});