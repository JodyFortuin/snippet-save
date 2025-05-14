import { Category } from '@/types';

const Categories: Category[] = [
  {
    id: 'personal',
    name: 'Personal',
    color: '#5856D6', // Purple
    icon: 'user',
  },
  {
    id: 'work',
    name: 'Work',
    color: '#007AFF', // Blue
    icon: 'briefcase',
  },
  {
    id: 'finance',
    name: 'Finance',
    color: '#34C759', // Green
    icon: 'credit-card',
  },
  {
    id: 'travel',
    name: 'Travel',
    color: '#FF9500', // Orange
    icon: 'map-pin',
  },
  {
    id: 'addresses',
    name: 'Addresses',
    color: '#FF2D55', // Pink
    icon: 'home',
  },
  {
    id: 'social',
    name: 'Social',
    color: '#5AC8FA', // Light Blue
    icon: 'share-2',
  },
  {
    id: 'other',
    name: 'Other',
    color: '#8E8E93', // Gray
    icon: 'more-horizontal',
  },
];

export default Categories;