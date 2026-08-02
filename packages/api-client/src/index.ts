import { Doctor, Product } from '@medivo/types';

export interface ApiClientConfig {
  baseUrl?: string;
}

export class MedivoApiClient {
  private baseUrl: string;

  constructor(config?: ApiClientConfig) {
    this.baseUrl = config?.baseUrl || 'http://localhost:4000';
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      return json.data as T;
    } catch (error: any) {
      console.warn(`[MedivoApiClient] Error requesting ${url}:`, error.message);
      throw error;
    }
  }

  // Auth Group
  public auth = {
    login: async (email: string, passwordHash: string) => {
      return this.request<{ user: any; token: string }>('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: passwordHash }),
      });
    },
  };

  // AI Skin Scans Group
  public scans = {
    analyze: async (userId: string, imageBase64: string) => {
      return this.request<any>('/api/v1/scans/analyze', {
        method: 'POST',
        body: JSON.stringify({ userId, imageBase64 }),
      });
    },
    getHistory: async (userId: string) => {
      return this.request<any[]>(`/api/v1/scans/history?userId=${userId}`);
    },
  };

  // Doctors Group
  public doctors = {
    list: async () => {
      return this.request<Doctor[]>('/api/v1/doctors');
    },
  };

  // Ecommerce & Orders Group
  public orders = {
    getDetails: async (orderId: string) => {
      return this.request<any>(`/api/v1/orders/${orderId}`);
    },
  };

  public products = {
    list: async () => {
      return this.request<Product[]>('/api/v1/products');
    },
  };
}

export const apiClient = new MedivoApiClient();
