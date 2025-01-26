import { withColorSchemes } from '@/lib/color-scheme/lib';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/admin',
        permanent: true,
      },
    ];
  },
};

export default withColorSchemes(nextConfig);
