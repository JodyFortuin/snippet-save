import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Snippet, RecentActivity, Category } from '@/types';
import mockSnippets from '@/data/snippets';
import mockRecentActivity from '@/data/recentActivity';
import defaultCategories from '@/constants/Categories';

interface AppContextType {
  snippets: Snippet[];
  recentActivity: RecentActivity[];
  categories: Category[];
  addSnippet: (snippet: Omit<Snippet, 'id' | 'dateCreated' | 'dateModified' | 'usageCount' | 'lastUsed'>) => void;
  updateSnippet: (id: string, updates: Partial<Snippet>) => void;
  deleteSnippet: (id: string) => void;
  toggleFavorite: (id: string) => void;
  copySnippet: (id: string) => void;
  getSnippetById: (id: string) => Snippet | undefined;
  getSnippetsByCategory: (categoryId: string) => Snippet[];
  getFavorites: () => Snippet[];
  searchSnippets: (query: string) => Snippet[];
  getRecentCopied: (limit?: number) => Snippet[];
  addCategory: (category: Omit<Category, 'id' | 'icon'>) => void;
  updateCategory: (id: string, updates: Partial<Omit<Category, 'id' | 'icon'>>) => void;
  deleteCategory: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SNIPPETS: 'snippets',
  RECENT_ACTIVITY: 'recentActivity',
  CATEGORIES: 'categories',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [storedSnippets, storedActivity, storedCategories] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.SNIPPETS),
          AsyncStorage.getItem(STORAGE_KEYS.RECENT_ACTIVITY),
          AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES),
        ]);

        setSnippets(storedSnippets ? JSON.parse(storedSnippets) : mockSnippets);
        setRecentActivity(storedActivity ? JSON.parse(storedActivity) : mockRecentActivity);
        setCategories(storedCategories ? JSON.parse(storedCategories) : defaultCategories);
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
        // Fall back to mock data if loading fails
        setSnippets(mockSnippets);
        setRecentActivity(mockRecentActivity);
        setCategories(defaultCategories);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save snippets to AsyncStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(STORAGE_KEYS.SNIPPETS, JSON.stringify(snippets));
    }
  }, [snippets, isLoading]);

  // Save recent activity to AsyncStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(STORAGE_KEYS.RECENT_ACTIVITY, JSON.stringify(recentActivity));
    }
  }, [recentActivity, isLoading]);

  // Save categories to AsyncStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    }
  }, [categories, isLoading]);

  const addSnippet = (newSnippet: Omit<Snippet, 'id' | 'dateCreated' | 'dateModified' | 'usageCount' | 'lastUsed'>) => {
    const timestamp = new Date().toISOString();
    const snippet: Snippet = {
      ...newSnippet,
      id: Date.now().toString(),
      dateCreated: timestamp,
      dateModified: timestamp,
      usageCount: 0,
      lastUsed: null,
    };

    setSnippets([snippet, ...snippets]);
    
    const activity: RecentActivity = {
      snippetId: snippet.id,
      action: 'created',
      timestamp,
    };
    setRecentActivity([activity, ...recentActivity]);
  };

  const updateSnippet = (id: string, updates: Partial<Snippet>) => {
    const timestamp = new Date().toISOString();
    
    setSnippets(
      snippets.map((snippet) =>
        snippet.id === id
          ? { ...snippet, ...updates, dateModified: timestamp }
          : snippet
      )
    );

    const activity: RecentActivity = {
      snippetId: id,
      action: 'edited',
      timestamp,
    };
    setRecentActivity([activity, ...recentActivity]);
  };

  const deleteSnippet = (id: string) => {
    setSnippets(snippets.filter((snippet) => snippet.id !== id));
    
    const activity: RecentActivity = {
      snippetId: id,
      action: 'deleted',
      timestamp: new Date().toISOString(),
    };
    setRecentActivity([activity, ...recentActivity]);
  };

  const toggleFavorite = (id: string) => {
    setSnippets(
      snippets.map((snippet) =>
        snippet.id === id ? { ...snippet, isFavorite: !snippet.isFavorite } : snippet
      )
    );
  };

  const copySnippet = (id: string) => {
    const timestamp = new Date().toISOString();
    
    setSnippets(
      snippets.map((snippet) =>
        snippet.id === id
          ? {
              ...snippet,
              usageCount: snippet.usageCount + 1,
              lastUsed: timestamp,
            }
          : snippet
      )
    );

    const activity: RecentActivity = {
      snippetId: id,
      action: 'copied',
      timestamp,
    };
    setRecentActivity([activity, ...recentActivity]);
  };

  const getSnippetById = (id: string) => {
    return snippets.find((snippet) => snippet.id === id);
  };

  const getSnippetsByCategory = (categoryId: string) => {
    return snippets.filter((snippet) => snippet.categoryId === categoryId);
  };

  const getFavorites = () => {
    return snippets.filter((snippet) => snippet.isFavorite);
  };

  const searchSnippets = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return snippets.filter(
      (snippet) =>
        snippet.title.toLowerCase().includes(lowerQuery) ||
        snippet.content.toLowerCase().includes(lowerQuery)
    );
  };

  const getRecentCopied = (limit = 5) => {
    const copiedActivities = recentActivity
      .filter((activity) => activity.action === 'copied')
      .slice(0, limit);
    
    return copiedActivities
      .map((activity) => snippets.find((s) => s.id === activity.snippetId))
      .filter((snippet): snippet is Snippet => snippet !== undefined);
  };

  const addCategory = (category: Omit<Category, 'id' | 'icon'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
      icon: 'folder',
    };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<Omit<Category, 'id' | 'icon'>>) => {
    setCategories(
      categories.map((category) =>
        category.id === id
          ? { ...category, ...updates }
          : category
      )
    );
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  if (isLoading) {
    return null;
  }

  return (
    <AppContext.Provider
      value={{
        snippets,
        recentActivity,
        categories,
        addSnippet,
        updateSnippet,
        deleteSnippet,
        toggleFavorite,
        copySnippet,
        getSnippetById,
        getSnippetsByCategory,
        getFavorites,
        searchSnippets,
        getRecentCopied,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};