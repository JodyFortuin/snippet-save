import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';
import { useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { Crown, Infinity, Search, FolderOpen, Star, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SUBSCRIPTION_FEATURES = [
  {
    id: 'history',
    title: 'Unlimited History',
    description: 'Never lose a clip again',
    icon: Infinity,
  },
  {
    id: 'search',
    title: 'Fast Search',
    description: 'Find your snippets instantly',
    icon: Search,
  },
  {
    id: 'categories',
    title: 'Smart Categories',
    description: 'Organize snippets by category',
    icon: FolderOpen,
  },
  {
    id: 'favorites',
    title: 'Favorites',
    description: 'Star important snippets for quick access',
    icon: Star,
  },
];

type SubscriptionOption = {
  id: string;
  productId: string;
  title: string;
  price: string;
  description: string;
  subtext?: string;
  perMonth?: string;
  tag?: string;
  highlight?: boolean;
};

const SUBSCRIPTION_OPTIONS: SubscriptionOption[] = [
  {
    id: 'lifetime',
    productId: 'snippet_pro_lifetime1',
    title: 'Lifetime',
    price: '$29.99',
    description: 'One-time payment',
    subtext: 'Never pay again',
    tag: 'BEST VALUE',
    highlight: true,
  },
  {
    id: 'yearly',
    productId: 'snippet_pro_year1',
    title: 'Annual Plan',
    price: '$11.99',
    description: 'Save 50%',
    perMonth: '$1.00/month',
  },
  {
    id: 'monthly',
    productId: 'snippet_pro_week1',
    title: 'Monthly Plan',
    price: '$1.99',
    description: 'Try it out',
  }
];

export default function Paywall() {
  const router = useRouter();
  const { setIsSubscribed } = useApp();
  const { startTrial, isInTrial, isLoading, purchasePackage } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState('lifetime');
  const insets = useSafeAreaInsets();

  const handleSubscribe = async () => {
    const option = SUBSCRIPTION_OPTIONS.find(opt => opt.id === selectedPlan);
    if (!option) return;

    try {
      if (selectedPlan === 'weekly' && !isInTrial) {
        await startTrial();
        setIsSubscribed(true);
        router.replace('/(tabs)');
        return;
      }

      const success = await purchasePackage(option.productId);
      if (success) {
        setIsSubscribed(true);
        router.replace('/(tabs)');
      }
    } catch (error) {
      Alert.alert(
        'Purchase Failed',
        'There was an error processing your purchase. Please try again later.'
      );
    }
  };

  const handleClose = () => {
    // When closing paywall, go to main app since onboarding is complete
    router.replace('/(tabs)');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <LinearGradient
        colors={['#3b82f6', '#1d4ed8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        <View style={[styles.header, { top: insets.top }]}>
          <TouchableOpacity 
            onPress={handleClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <View style={styles.crownContainer}>
              <Crown size={24} color="#1a202c" />
            </View>
            <Text style={styles.title}>Unlock Premium</Text>
            <Text style={styles.subtitle}>Supercharge your clipboard experience</Text>
          </View>

          <View style={styles.features}>
            {SUBSCRIPTION_FEATURES.map((feature) => (
              <View key={feature.id} style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <feature.icon size={20} color="#FFFFFF" />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>

      <View style={styles.bottomSection}>
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          <>
            <View style={styles.bestValueBadge}>
              <Text style={styles.bestValueText}>BEST VALUE</Text>
            </View>

            <View style={styles.plans}>
              {SUBSCRIPTION_OPTIONS.map((plan) => (
                <Pressable
                  key={plan.id}
                  style={[
                    styles.planContainer,
                    selectedPlan === plan.id && styles.selectedPlan,
                    plan.highlight && styles.highlightedPlan
                  ]}
                  onPress={() => setSelectedPlan(plan.id)}
                >
                  <View style={styles.planContent}>
                    <View style={styles.planHeader}>
                      <View>
                        <Text style={styles.planTitle}>{plan.title}</Text>
                        <Text style={styles.planDescription}>{plan.description}</Text>
                      </View>
                      <View style={styles.priceContainer}>
                        <Text style={styles.planPrice}>{plan.price}</Text>
                        {plan.id === 'lifetime' && (
                          <Text style={styles.foreverText}>forever</Text>
                        )}
                        {plan.id === 'yearly' && (
                          <Text style={styles.perText}>per year</Text>
                        )}
                        {plan.id === 'monthly' && (
                          <Text style={styles.perText}>per month</Text>
                        )}
                      </View>
                    </View>
                    {plan.subtext && plan.id === 'lifetime' && (
                      <View style={styles.subtextContainer}>
                        <Infinity size={16} color="#1d4ed8" />
                        <Text style={styles.planSubtext}>{plan.subtext}</Text>
                      </View>
                    )}
                    {plan.perMonth && (
                      <View style={styles.perMonthContainer}>
                        <Text style={styles.perMonthText}>{plan.perMonth}</Text>
                      </View>
                    )}
                  </View>
                </Pressable>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.subscribeButton}
              onPress={handleSubscribe}
              disabled={isLoading}
            >
              <Text style={styles.subscribeText}>Start Free Trial</Text>
            </TouchableOpacity>

            <Text style={styles.terms}>
              7 days free, then $29.99 one-time
            </Text>

            <View style={styles.footer}>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Terms of Service</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Privacy Policy</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Restore</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  gradientContainer: {
    paddingBottom: 32,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 48,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    zIndex: 1,
  },
  content: {
    paddingTop: 120,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  crownContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffd700',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  features: {
    marginBottom: 0,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  bottomSection: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 40,
    marginTop: -20,
  },
  bestValueBadge: {
    alignItems: 'center',
    marginBottom: 24,
  },
  bestValueText: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
  },
  plans: {
    marginBottom: 32,
  },
  planContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedPlan: {
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  highlightedPlan: {
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  planContent: {
    flex: 1,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 2,
  },
  planDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3b82f6',
  },
  foreverText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  perText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  subtextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 8,
  },
  planSubtext: {
    fontSize: 14,
    color: '#1d4ed8',
    marginLeft: 4,
    fontWeight: '500',
  },
  perMonthContainer: {
    backgroundColor: '#f9fafb',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  perMonthText: {
    fontSize: 14,
    color: '#374151',
  },
  subscribeButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  subscribeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  terms: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  footerLink: {
    color: '#6b7280',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});