/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['@medivo/ui', '@medivo/types', '@medivo/theme', '@medivo/design-system', '@medivo/utils'],
  async rewrites() {
    const internalApiUrl = process.env.INTERNAL_API_URL || 'http://customer-bff:4000';
    return [
      {
        source: '/api/:path*',
        destination: `${internalApiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
