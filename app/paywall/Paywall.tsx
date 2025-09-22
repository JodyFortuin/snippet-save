import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, ActivityIndicator, Alert } from 'react-native';
import Colors from '../../constants/Colors';
import { useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { Crown, History, FolderTree, Star, Clock, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SUBSCRIPTION_FEATURES = [
  {
    id: 'history',
    title: 'Unlimited History',
    description: 'Never lose a snippet again',
    icon: History,
  },
  {
    id: 'categories',
    title: 'Smart Categories',
    description: 'Organize snippets by language & type',
    icon: FolderTree,
  },
  {
    id: 'favorites',
    title: 'Favorites & Search',
    description: 'Quick access to important snippets',
    icon: Star,
  },
  {
    id: 'sync',
    title: 'Recent Activity',
    description: 'Track your snippet usage history',
    icon: Clock,
  },
];

type SubscriptionOption = {
  id: string;
  productId: string;
  title: string;
  price: string;
  description: string;
  subtext: string;
  perMonth?: string;
  trial?: string;
  tag?: string;
  feature?: string;
};

const SUBSCRIPTION_OPTIONS: SubscriptionOption[] = [
  {
    id: 'lifetime',
    productId: 'snippet_pro_lifetime1',
    title: 'Lifetime',
    price: '$29.99',
    description: 'One-time payment',
    subtext: 'forever',
    tag: 'BEST VALUE',
    feature: 'Never pay again',
  },
  {
    id: 'yearly',
    productId: 'snippet_pro_year1',
    title: 'Annual Plan',
    price: '$11.99',
    description: 'per year',
    subtext: 'Save 50%',
    perMonth: '$1.00/month',
  },
  {
    id: 'monthly',
    productId: 'snippet_pro_week1',
    title: 'Monthly Plan',
    price: '$1.99',
    description: 'per month',
    subtext: 'Try it out',
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


  return (
    <View style={styles.container}>
      <View style={[styles.header, { top: insets.top }]}>
        <TouchableOpacity 
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <View style={styles.crownContainer}>
            <Crown size={24} color="#FFD700" />
          </View>
          <Text style={styles.title}>Unlock Premium</Text>
          <Text style={styles.subtitle}>Supercharge your clipboard experience</Text>
        </View>

        <View style={styles.features}>
          {SUBSCRIPTION_FEATURES.map((feature) => (
            <View key={feature.id} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <feature.icon size={20} color={Colors.primary} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          <>
            <View style={styles.plans}>
              {SUBSCRIPTION_OPTIONS.map((plan) => (
                <Pressable
                  key={plan.id}
                  style={[
                    styles.planContainer,
                    selectedPlan === plan.id && styles.selectedPlan
                  ]}
                  onPress={() => setSelectedPlan(plan.id)}
                >
                  {plan.tag && (
                    <View style={styles.tagContainer}>
                      <Text style={styles.tagText}>{plan.tag}</Text>
                    </View>
                  )}
                  <View style={styles.planContent}>
                    <View style={styles.planHeader}>
                      <Text style={styles.planTitle}>{plan.title}</Text>
                      <Text style={styles.planPrice}>{plan.price}</Text>
                    </View>
                    <Text style={styles.planDescription}>{plan.description}</Text>
                    {plan.subtext && (
                      <Text style={styles.planSubtext}>{plan.subtext}</Text>
                    )}
                    {plan.perMonth && (
                      <Text style={styles.perMonthText}>{plan.perMonth}</Text>
                    )}
                    {plan.trial && (
                      <View style={styles.trialTag}>
                        <Text style={styles.trialText}>{plan.trial}</Text>
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
              <Text style={styles.subscribeText}>
                {selectedPlan === 'weekly' && !isInTrial ? 'Start Free Trial' : 'Continue'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.terms}>
              {selectedPlan === 'weekly' ? '3 days free, then ' : ''}{SUBSCRIPTION_OPTIONS.find(p => p.id === selectedPlan)?.price} {selectedPlan === 'weekly' ? 'per week' : 'per year'}
            </Text>

            <View style={styles.footer}>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Terms of Service</Text>
              </TouchableOpacity>
              <Text style={styles.footerDot}>•</Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Privacy Policy</Text>
              </TouchableOpacity>
              <Text style={styles.footerDot}>•</Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Restore</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4169E1',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    position: 'absolute',
    top: 16,
    right: 0,
    zIndex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    marginHorizontal: 16,
    marginTop: 48,
    marginBottom: 0,
    paddingTop: 32,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  crownContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  features: {
    marginBottom: 40,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(65, 105, 225, 0.08)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 15,
    color: '#666666',
    lineHeight: 20,
  },
  plans: {
    marginBottom: 24,
  },
  planContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  selectedPlan: {
    borderColor: '#4169E1',
    borderWidth: 2,
  },
  tagContainer: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    backgroundColor: '#4169E1',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 100,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  planContent: {
    flex: 1,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  planPrice: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
  },
  planDescription: {
    fontSize: 15,
    color: '#666666',
    marginTop: 4,
  },
  planSubtext: {
    fontSize: 15,
    color: '#4169E1',
    marginTop: 8,
  },
  perMonthText: {
    fontSize: 13,
    color: '#666666',
    marginTop: 4,
  },
  trialTag: {
    backgroundColor: 'rgba(65, 105, 225, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  trialText: {
    color: '#4169E1',
    fontSize: 13,
    fontWeight: '600',
  },
  subscribeButton: {
    backgroundColor: '#4169E1',
    paddingVertical: 18,
    borderRadius: 100,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  subscribeText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  terms: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  footerLink: {
    color: '#666666',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  footerDot: {
    display: 'none',
  },
}); 