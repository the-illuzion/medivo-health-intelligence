import { Doctor, Product } from '@medivo/types';

export interface ApiClientConfig {
  baseUrl?: string;
  authToken?: string | null;
}

export class MedivoApiClient {
  private baseUrl: string;
  private authToken: string | null = null;
  public onError?: (error: Error) => void;

  constructor(config?: ApiClientConfig) {
    const envUrl =
      (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
      (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) ||
      (typeof process !== 'undefined' && process.env?.API_URL);
    this.baseUrl = config?.baseUrl || envUrl || 'http://localhost:4000';
    this.authToken = config?.authToken || null;
  }

  public setAuthToken(token: string | null) {
    this.authToken = token;
  }

  public getAuthToken(): string | null {
    return this.authToken;
  }

  public async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const url = `${this.baseUrl}/api/mobile-bff/health`;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const response = await fetch(url, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Connection response: ${response.status}`);
      }

      const json = await response.json();
      return { status: json.status || 'HEALTHY', timestamp: new Date().toISOString() };
    } catch (error: any) {
      const err = new Error(error.name === 'AbortError' ? 'Connection request timed out' : 'Unable to connect to Medivo Services');
      if (this.onError) this.onError(err);
      throw err;
    }
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string>),
    };
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        try {
          const json = await response.json();
          if (json && (json.error || json.message)) {
            const err = new Error(json.error || json.message);
            if (response.status >= 500 && this.onError) this.onError(err);
            throw err;
          }
        } catch (e) {
          if (e instanceof Error && e.message !== `Unable to connect: ${response.status}`) {
            throw e;
          }
        }
        const httpError = new Error(`Unable to complete request (${response.status})`);
        if (response.status >= 500 && this.onError) this.onError(httpError);
        throw httpError;
      }

      const json = await response.json();
      return json.data as T;
    } catch (error: any) {
      console.warn(`[MedivoApiClient] Error requesting ${url}:`, error.message);
      if (error.name === 'TypeError' || error.message.includes('Network') || error.message.includes('fetch')) {
        if (this.onError) this.onError(new Error('Unable to establish a connection to Medivo Services'));
      }
      throw error;
    }
  }

  // ============================================================================
  // Mobile / Customer BFF Group (/api/mobile-bff)
  // ============================================================================
  public auth = {
    login: async (email: string, passwordHash: string) => {
      const result = await this.request<{ user: any; token: string }>('/api/mobile-bff/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: passwordHash }),
      });
      if (result && result.token) {
        this.setAuthToken(result.token);
      }
      return result;
    },
    register: async (name: string, email: string, skinType?: string) => {
      const result = await this.request<{ user: any; token: string }>('/api/mobile-bff/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, skinType }),
      });
      if (result && result.token) {
        this.setAuthToken(result.token);
      }
      return result;
    },
    logout: async () => {
      try {
        await this.request<any>('/api/mobile-bff/auth/logout', { method: 'POST' });
      } catch (e) {
      } finally {
        this.setAuthToken(null);
      }
    },
    getProfile: async () => {
      return this.request<any>('/api/mobile-bff/user/profile');
    },
  };

  public scans = {
    analyze: async (imageBase64: string) => {
      return this.request<any>('/api/mobile-bff/scans/analyze', {
        method: 'POST',
        body: JSON.stringify({ imageBase64 }),
      });
    },
    getHistory: async () => {
      return this.request<any[]>('/api/mobile-bff/scans/history');
    },
    getDetails: async (scanId: string) => {
      return this.request<any>(`/api/mobile-bff/scans/${scanId}`);
    },
  };

  public routines = {
    list: async () => {
      return this.request<any[]>('/api/mobile-bff/routines');
    },
    getDetails: async (routineId: string) => {
      return this.request<any>(`/api/mobile-bff/routines/${routineId}`);
    },
    toggleStep: async (routineId: string, stepId: string, completed: boolean) => {
      return this.request<any>('/api/mobile-bff/routines/step', {
        method: 'POST',
        body: JSON.stringify({ routineId, stepId, completed }),
      });
    },
  };

  public coach = {
    chat: async (message: string) => {
      return this.request<any>('/api/mobile-bff/coach/chat', {
        method: 'POST',
        body: JSON.stringify({ message }),
      });
    },
  };

  public doctors = {
    list: async () => {
      return this.request<Doctor[]>('/api/mobile-bff/doctors');
    },
  };

  public appointments = {
    list: async () => {
      return this.request<any[]>('/api/mobile-bff/appointments');
    },
    book: async (booking: { doctorId: string; doctorName: string; date: string; time: string; condition?: string }) => {
      return this.request<any>('/api/mobile-bff/appointments/book', {
        method: 'POST',
        body: JSON.stringify(booking),
      });
    },
  };

  public products = {
    list: async () => {
      return this.request<Product[]>('/api/mobile-bff/products');
    },
  };

  public orders = {
    getDetails: async (orderId: string) => {
      return this.request<any>(`/api/mobile-bff/orders/${orderId}`);
    },
    checkout: async (items: any[], totalAmount: number) => {
      return this.request<any>('/api/mobile-bff/checkout', {
        method: 'POST',
        body: JSON.stringify({ items, totalAmount }),
      });
    },
  };

  public notifications = {
    list: async () => {
      return this.request<{ notifications: any[]; unreadCount: number }>('/api/mobile-bff/notifications');
    },
    markAsRead: async (notifId: string) => {
      return this.request<{ notifications: any[]; unreadCount: number }>(`/api/mobile-bff/notifications/${notifId}/read`, {
        method: 'PUT',
      });
    },
    markAllAsRead: async () => {
      return this.request<{ notifications: any[]; unreadCount: number }>('/api/mobile-bff/notifications/mark-all-read', {
        method: 'POST',
      });
    },
  };

  // ============================================================================
  // Admin BFF Group (/api/admin-bff)
  // ============================================================================
  public admin = {
    getHipaaAudit: async () => {
      return this.request<any[]>('/api/admin-bff/hipaa-audit');
    },
    getTelemetryStats: async () => {
      return this.request<any>('/api/admin-bff/telemetry-stats');
    },
  };
}

export const apiClient = new MedivoApiClient();
