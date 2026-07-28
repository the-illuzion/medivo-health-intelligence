/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@medivo/types", "@medivo/utils", "@medivo/ui", "@medivo/design-system"],
};

export default nextConfig;
