import { authService } from './authService';
import env from '../config/env';
import { RequestConfig } from '../types/http.types';

// HTTP client class
class HttpClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = env.API_URL;
  }

  // Method for building URL with parameters
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }

  // Method for adding authorization headers
  private getAuthHeaders(): HeadersInit {
    const token = authService.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // Method for performing HTTP requests
  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { params, headers, ...restConfig } = config;
    const url = this.buildUrl(endpoint, params);
    
    // Combine authentication headers with headers passed in the configuration
    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
      ...headers,
    };
    
    try {
      const response = await fetch(url, {
        ...restConfig,
        headers: requestHeaders,
      });
      
      // If status 204 (No Content), return empty response
      if (response.status === 204) {
        return {} as T;
      }
      
      // For other statuses, try to parse JSON
      const data = await response.json();
      
      // Check if the response is successful
      if (!response.ok) {
        throw new Error(data.message || 'An error occurred while making the request');
      }
      
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unknown error occurred while making the request');
    }
  }

  // HTTP methods
  async get<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { 
      ...config, 
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { 
      ...config, 
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { 
      ...config, 
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

// Export instance
export const httpClient = new HttpClient(); 