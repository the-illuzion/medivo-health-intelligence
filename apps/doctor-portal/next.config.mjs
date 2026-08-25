/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  transpilePackages: ['@medivo/ui', '@medivo/types', '@medivo/theme', '@medivo/design-system', '@medivo/utils'],
  async rewrites() {
    const internalApiUrl = process.env.INTERNAL_API_URL || 'http://customer-bff:4000';
    return [
      {
        source: '/api/:path*',
        destination: `${internalApiUrl}/api/:path*`,
      },
      {
        source: '/health',
        destination: `${internalApiUrl}/health`,
      },
    ];
  },
};

export default nextConfig;
