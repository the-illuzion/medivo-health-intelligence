/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  transpilePackages: ['@medivo/ui', '@medivo/types', '@medivo/theme', '@medivo/design-system', '@medivo/utils'],
  async rewrites() {
    const internalApiUrl = process.env.INTERNAL_API_URL || 'http://customer-bff:4000';
    const internalAppUrl = process.env.INTERNAL_APP_URL || 'http://customer-app:8081';
    const internalDoctorUrl = process.env.INTERNAL_DOCTOR_URL || 'http://doctor-portal:3001';
    const internalAdminUrl = process.env.INTERNAL_ADMIN_URL || 'http://admin-panel:3002';

    return [
      {
        source: '/api/:path*',
        destination: `${internalApiUrl}/api/:path*`,
      },
      {
        source: '/app/:path*',
        destination: `${internalAppUrl}/:path*`,
      },
      {
        source: '/app',
        destination: `${internalAppUrl}/`,
      },
      {
        source: '/doctor-portal/:path*',
        destination: `${internalDoctorUrl}/:path*`,
      },
      {
        source: '/doctor-portal',
        destination: `${internalDoctorUrl}/`,
      },
      {
        source: '/admin-panel/:path*',
        destination: `${internalAdminUrl}/:path*`,
      },
      {
        source: '/admin-panel',
        destination: `${internalAdminUrl}/`,
      },
    ];
  },
};

export default nextConfig;
