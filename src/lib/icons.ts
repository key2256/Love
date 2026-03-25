import { Layout, Tag, Share2, Calendar, Phone, Settings, LucideIcon } from 'lucide-react';

export const getIconForCategory = (category: string): LucideIcon => {
  switch (category.toLowerCase()) {
    case 'logo':
      return Layout;
    case 'pricing':
      return Tag;
    case 'social-media':
      return Share2;
    case 'calendar':
      return Calendar;
    case 'contact':
      return Phone;
    case 'settings':
      return Settings;
    default:
      return Layout;
  }
};
