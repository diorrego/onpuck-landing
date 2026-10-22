import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Agents asking for Markdown get the same paper as text (content negotiation).
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          destination: '/index.md',
          has: [{ type: 'header', key: 'accept', value: '(.*)text/markdown(.*)' }],
        },
      ],
    };
  },
  async headers() {
    return [
      { source: '/', headers: [{ key: 'Vary', value: 'Accept' }, { key: 'Link', value: '</index.md>; rel="alternate"; type="text/markdown"' }] },
      { source: '/scene/:file*', headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }] },
    ];
  },
};

export default nextConfig;
