import type { MetadataRoute } from 'next';
import { CONTENT_UPDATED, SITE_URL } from '@/content/paper';

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE_URL}/`, lastModified: CONTENT_UPDATED, changeFrequency: 'monthly', priority: 1 }];
}
