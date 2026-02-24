import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      // Allow http images
      { protocol: 'http', hostname: '**' },
    ],
  },
};

export default nextConfig;
