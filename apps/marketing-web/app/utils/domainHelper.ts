'use client';

import { useState, useEffect } from 'react';

/**
 * Resolves the URL for the Customer Web Application (Patient Portal).
 * Prioritizes process.env.NEXT_PUBLIC_APP_URL, then inspects client hostname,
 * and falls back to production DuckDNS domain.
 */
export function getAppUrl(): string {
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined' && window.location) {
    const rawHost = window.location.hostname;
    const host = rawHost.replace(/^www\./, '');
    const protocol = window.location.protocol;
    const port = window.location.port ? `:${window.location.port}` : '';

    // DuckDNS domain routing (e.g. medivo.duckdns.org -> medivo-app.duckdns.org)
    if (host.endsWith('duckdns.org')) {
      if (host.startsWith('medivo-') || host === 'medivo.duckdns.org') {
        return `${protocol}//medivo-app.duckdns.org${port}`;
      }
      if (host.startsWith('main.') || host.startsWith('doctor.') || host.startsWith('admin.')) {
        return `${protocol}//app.${host.replace(/^(main|doctor|admin)\./, '')}${port}`;
      }
      return `${protocol}//medivo-app.duckdns.org${port}`;
    }

    // sslip.io domain routing (e.g. main.80.225.215.96.sslip.io -> app.80.225.215.96.sslip.io)
    if (host.endsWith('sslip.io')) {
      if (host.startsWith('main.') || host.startsWith('doctor.') || host.startsWith('admin.')) {
        return `${protocol}//app.${host.replace(/^(main|doctor|admin)\./, '')}${port}`;
      }
      return `${protocol}//app.${host}${port}`;
    }

    // Local development environment
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:8081';
    }

    // Custom domain routing (e.g. main.example.com -> app.example.com)
    if (host.startsWith('main.')) {
      return `${protocol}//app.${host.substring(5)}${port}`;
    }
    return `${protocol}//app.${host}${port}`;
  }

  return 'https://medivo-app.duckdns.org';
}

/**
 * Resolves the URL for the Doctor Clinical Portal.
 */
export function getDoctorUrl(): string {
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_DOCTOR_URL) {
    return process.env.NEXT_PUBLIC_DOCTOR_URL.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined' && window.location) {
    const rawHost = window.location.hostname;
    const host = rawHost.replace(/^www\./, '');
    const protocol = window.location.protocol;
    const port = window.location.port ? `:${window.location.port}` : '';

    if (host.endsWith('duckdns.org')) {
      if (host.startsWith('medivo-') || host === 'medivo.duckdns.org') {
        return `${protocol}//medivo-doctor.duckdns.org${port}`;
      }
      if (host.startsWith('main.') || host.startsWith('app.') || host.startsWith('admin.')) {
        return `${protocol}//doctor.${host.replace(/^(main|app|admin)\./, '')}${port}`;
      }
      return `${protocol}//medivo-doctor.duckdns.org${port}`;
    }

    if (host.endsWith('sslip.io')) {
      if (host.startsWith('main.') || host.startsWith('app.') || host.startsWith('admin.')) {
        return `${protocol}//doctor.${host.replace(/^(main|app|admin)\./, '')}${port}`;
      }
      return `${protocol}//doctor.${host}${port}`;
    }

    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:3001';
    }

    if (host.startsWith('main.')) {
      return `${protocol}//doctor.${host.substring(5)}${port}`;
    }
    return `${protocol}//doctor.${host}${port}`;
  }

  return 'https://medivo-doctor.duckdns.org';
}

/**
 * Resolves the URL for the Platform Admin Console.
 */
export function getAdminUrl(): string {
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_ADMIN_URL) {
    return process.env.NEXT_PUBLIC_ADMIN_URL.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined' && window.location) {
    const rawHost = window.location.hostname;
    const host = rawHost.replace(/^www\./, '');
    const protocol = window.location.protocol;
    const port = window.location.port ? `:${window.location.port}` : '';

    if (host.endsWith('duckdns.org')) {
      if (host.startsWith('medivo-') || host === 'medivo.duckdns.org') {
        return `${protocol}//medivo-admin.duckdns.org${port}`;
      }
      if (host.startsWith('main.') || host.startsWith('app.') || host.startsWith('doctor.')) {
        return `${protocol}//admin.${host.replace(/^(main|app|doctor)\./, '')}${port}`;
      }
      return `${protocol}//medivo-admin.duckdns.org${port}`;
    }

    if (host.endsWith('sslip.io')) {
      if (host.startsWith('main.') || host.startsWith('app.') || host.startsWith('doctor.')) {
        return `${protocol}//admin.${host.replace(/^(main|app|doctor)\./, '')}${port}`;
      }
      return `${protocol}//admin.${host}${port}`;
    }

    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:3002';
    }

    if (host.startsWith('main.')) {
      return `${protocol}//admin.${host.substring(5)}${port}`;
    }
    return `${protocol}//admin.${host}${port}`;
  }

  return 'https://medivo-admin.duckdns.org';
}

/**
 * Resolves the URL for the Customer BFF API Gateway.
 */
export function getApiUrl(): string {
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined' && window.location) {
    const rawHost = window.location.hostname;
    const host = rawHost.replace(/^www\./, '');
    const protocol = window.location.protocol;
    const port = window.location.port ? `:${window.location.port}` : '';

    if (host.endsWith('duckdns.org')) {
      if (host.startsWith('medivo-') || host === 'medivo.duckdns.org') {
        return `${protocol}//medivo-api.duckdns.org${port}`;
      }
      if (host.startsWith('main.') || host.startsWith('app.') || host.startsWith('doctor.') || host.startsWith('admin.')) {
        return `${protocol}//api.${host.replace(/^(main|app|doctor|admin)\./, '')}${port}`;
      }
      return `${protocol}//medivo-api.duckdns.org${port}`;
    }

    if (host.endsWith('sslip.io')) {
      if (host.startsWith('main.') || host.startsWith('app.') || host.startsWith('doctor.') || host.startsWith('admin.')) {
        return `${protocol}//api.${host.replace(/^(main|app|doctor|admin)\./, '')}${port}`;
      }
      return `${protocol}//api.${host}${port}`;
    }

    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:4000';
    }

    if (host.startsWith('main.')) {
      return `${protocol}//api.${host.substring(5)}${port}`;
    }
    return `${protocol}//api.${host}${port}`;
  }

  return 'https://medivo-api.duckdns.org';
}

/**
 * React hook providing dynamic domain URLs that update seamlessly upon client hydration.
 */
export function useDomainUrls() {
  const [urls, setUrls] = useState({
    appUrl: getAppUrl(),
    doctorUrl: getDoctorUrl(),
    adminUrl: getAdminUrl(),
    apiUrl: getApiUrl(),
  });

  useEffect(() => {
    setUrls({
      appUrl: getAppUrl(),
      doctorUrl: getDoctorUrl(),
      adminUrl: getAdminUrl(),
      apiUrl: getApiUrl(),
    });
  }, []);

  return urls;
}
