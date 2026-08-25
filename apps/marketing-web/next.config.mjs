/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  transpilePackages: ['@medivo/ui', '@medivo/types', '@medivo/theme', '@medivo/design-system', '@medivo/utils'],
};

export default nextConfig;

