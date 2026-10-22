import type { MetadataRoute } from 'next';
import { paper } from '@/content/paper';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'onpuck',
    short_name: 'onpuck',
    description: paper.description,
    start_url: '/',
    display: 'browser',
    background_color: '#f2f4f7',
    theme_color: '#f2f4f7',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
