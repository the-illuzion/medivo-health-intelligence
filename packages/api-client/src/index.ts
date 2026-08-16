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
    this.baseUrl = config?.baseUrl || 'http://localhost:4000';
    this.authToken = config?.authToken || null;
  }

  public setAuthToken(token: string | null) {
    this.authToken = token;
  }

  public async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const url = `${this.baseUrl}/health`;
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
      // Notify onError handler for network unreachable failures (fetch throw)
      if (error.name === 'TypeError' || error.message.includes('Network') || error.message.includes('fetch')) {
        if (this.onError) this.onError(new Error('Unable to establish a connection to Medivo Services'));
      }
      throw error;
    }
  }

  // Auth & Profile Group
  public auth = {
    login: async (email: string, passwordHash: string) => {
      const result = await this.request<{ user: any; token: string }>('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: passwordHash }),
      });
      if (result && result.token) {
        this.setAuthToken(result.token);
      }
      return result;
    },
    register: async (name: string, email: string, skinType?: string) => {
      const result = await this.request<{ user: any; token: string }>('/api/v1/auth/register', {
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
        await this.request<any>('/api/v1/auth/logout', { method: 'POST' });
      } catch (e) {
      } finally {
        this.setAuthToken(null);
      }
    },
    getProfile: async () => {
      return this.request<any>('/api/v1/user/profile');
    },
  };

  // AI Skin Scans Telemetry Group
  public scans = {
    analyze: async (imageBase64: string) => {
      return this.request<any>('/api/v1/scans/analyze', {
        method: 'POST',
        body: JSON.stringify({ imageBase64 }),
      });
    },
    getHistory: async () => {
      return this.request<any[]>('/api/v1/scans/history');
    },
    getDetails: async (scanId: string) => {
      return this.request<any>(`/api/v1/scans/${scanId}`);
    },
  };

  // Routines & AI Health Coach Group
  public routines = {
    list: async () => {
      return this.request<any[]>('/api/v1/routines');
    },
    getDetails: async (routineId: string) => {
      return this.request<any>(`/api/v1/routines/${routineId}`);
    },
    toggleStep: async (routineId: string, stepId: string, completed: boolean) => {
      return this.request<any>('/api/v1/routines/step', {
        method: 'POST',
        body: JSON.stringify({ routineId, stepId, completed }),
      });
    },
  };

  public coach = {
    chat: async (message: string) => {
      return this.request<any>('/api/v1/coach/chat', {
        method: 'POST',
        body: JSON.stringify({ message }),
      });
    },
  };

  // Doctors & Appointments Group
  public doctors = {
    list: async () => {
      return this.request<Doctor[]>('/api/v1/doctors');
    },
  };

  public appointments = {
    list: async () => {
      return this.request<any[]>('/api/v1/appointments');
    },
    book: async (booking: { doctorId: string; doctorName: string; date: string; time: string; condition?: string }) => {
      return this.request<any>('/api/v1/appointments/book', {
        method: 'POST',
        body: JSON.stringify(booking),
      });
    },
  };

  // Ecommerce, Cart & Orders Group
  public products = {
    list: async () => {
      return this.request<Product[]>('/api/v1/products');
    },
  };

  public orders = {
    getDetails: async (orderId: string) => {
      return this.request<any>(`/api/v1/orders/${orderId}`);
    },
    checkout: async (items: any[], totalAmount: number) => {
      return this.request<any>('/api/v1/checkout', {
        method: 'POST',
        body: JSON.stringify({ items, totalAmount }),
      });
    },
  };

  // Notifications & Admin Console Group
  public notifications = {
    list: async () => {
      return this.request<{ notifications: any[]; unreadCount: number }>('/api/v1/notifications');
    },
    markAsRead: async (notifId: string) => {
      return this.request<{ notifications: any[]; unreadCount: number }>(`/api/v1/notifications/${notifId}/read`, {
        method: 'PUT',
      });
    },
    markAllAsRead: async () => {
      return this.request<{ notifications: any[]; unreadCount: number }>('/api/v1/notifications/mark-all-read', {
        method: 'POST',
      });
    },
  };

  public admin = {
    getHipaaAudit: async () => {
      return this.request<any[]>('/api/v1/admin/hipaa-audit');
    },
    getTelemetryStats: async () => {
      return this.request<any>('/api/v1/admin/telemetry-stats');
    },
  };
}

export const apiClient = new MedivoApiClient();
