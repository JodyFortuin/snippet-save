import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SubscriptionContextType {
  trialEndDate: Date | null;
  hasTrialReminder: boolean;
  startTrial: () => Promise<void>;
  setTrialReminder: (enabled: boolean) => Promise<void>;
  isInTrial: boolean;
  isLoading: boolean;
  purchasePackage: (productId: string) => Promise<boolean>;
}

const STORAGE_KEYS = {
  TRIAL_END_DATE: 'trial_end_date',
  TRIAL_REMINDER: 'trial_reminder',
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [trialEndDate, setTrialEndDate] = useState<Date | null>(null);
  const [hasTrialReminder, setHasTrialReminder] = useState(false);
  const [isInTrial, setIsInTrial] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved trial data
  useEffect(() => {
    loadTrialData();
  }, []);

  // Check trial status
  useEffect(() => {
    if (trialEndDate) {
      const now = new Date();
      setIsInTrial(now < new Date(trialEndDate));
    } else {
      setIsInTrial(false);
    }
  }, [trialEndDate]);

  async function loadTrialData() {
    try {
      const [savedEndDate, savedReminder] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.TRIAL_END_DATE),
        AsyncStorage.getItem(STORAGE_KEYS.TRIAL_REMINDER),
      ]);
      
      if (savedEndDate) {
        const endDate = new Date(savedEndDate);
        setTrialEndDate(endDate);
        
        // Check if trial is still valid
        const now = new Date();
        setIsInTrial(now < endDate);
      }
      
      setHasTrialReminder(savedReminder === 'true');
    } catch (error) {
      console.error('Error loading trial data:', error);
    }
  }

  async function startTrial() {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 3); // 3-day trial
    
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TRIAL_END_DATE, endDate.toISOString());
      setTrialEndDate(endDate);
      setIsInTrial(true);
    } catch (error) {
      console.error('Error starting trial:', error);
    }
  }

  async function setTrialReminder(enabled: boolean) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TRIAL_REMINDER, enabled.toString());
      setHasTrialReminder(enabled);
    } catch (error) {
      console.error('Error setting trial reminder:', error);
    }
  }

  async function purchasePackage(productId: string): Promise<boolean> {
    try {
      setIsLoading(true);
      // TODO: Implement actual purchase logic with RevenueCat
      // For now, simulate a successful purchase
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      console.error('Error purchasing package:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SubscriptionContext.Provider
      value={{
        trialEndDate,
        hasTrialReminder,
        isInTrial,
        startTrial,
        setTrialReminder,
        isLoading,
        purchasePackage,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};


