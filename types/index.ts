export interface Snippet {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  dateCreated: string;
  dateModified: string;
  isFavorite: boolean;
  usageCount: number;
  lastUsed: string | null;
}

export interface RecentActivity {
  snippetId: string;
  action: 'copied' | 'created' | 'edited' | 'deleted';
  timestamp: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}