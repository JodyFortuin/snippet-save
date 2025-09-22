import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, ActivityIndicator, Alert, ScrollView } from 'react-native';
import Colors from '../../constants/Colors';
import { useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { Crown, Infinity, RefreshCw, FolderOpen, Shield, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SUBSCRIPTION_FEATURES = [
  {
    id: 'history',
    title: 'Unlimited History',
    description: 'Never lose a clip again',
    icon: Infinity,
  },
  {
    id: 'sync',
    title: 'Cross-Device Sync',
    description: 'Access clips on all your devices',
    icon: RefreshCw,
  },
  {
    id: 'collections',
    title: 'Custom Collections',
    description: 'Organize clips your way',
    icon: FolderOpen,
  },
  {
    id: 'security',
    title: 'Advanced Security',
    description: 'Password protection & encryption',
    icon: Shield,
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
            <Crown size={24} color="#000000" />
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

      <View style={styles.bottomSection}>
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
                    selectedPlan === plan.id && styles.selectedPlan,
                    plan.highlight && styles.highlightedPlan
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
                        <Infinity size={16} color="#4169E1" />
                        <Text style={styles.planSubtext}>{plan.subtext}</Text>
                      </View>
                    )}
                    {plan.perMonth && (
                      <Text style={styles.perMonthText}>{plan.perMonth}</Text>
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
    backgroundColor: '#5B7EF5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    zIndex: 1,
  },
  content: {
    paddingTop: 120,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  crownContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  features: {
    marginBottom: 0,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
  },
  bottomSection: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 40,
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
  highlightedPlan: {
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
    marginBottom: 8,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 15,
    color: '#666666',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
  },
  foreverText: {
    fontSize: 15,
    color: '#666666',
    marginTop: 2,
  },
  perText: {
    fontSize: 15,
    color: '#666666',
    marginTop: 2,
  },
  subtextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(65, 105, 225, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 100,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  planSubtext: {
    fontSize: 15,
    color: '#4169E1',
    marginLeft: 6,
    fontWeight: '500',
  },
  perMonthText: {
    fontSize: 13,
    color: '#666666',
    marginTop: 4,
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
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  footerLink: {
    color: '#666666',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});