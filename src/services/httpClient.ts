import env from '../config/env';
import { RequestConfig } from '../types/http.types';

// HTTP client class
class HttpClient {
  private baseUrl: string;
  private isRefreshing = false;
  private readonly TOKEN_KEY = 'auth_token';

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
    const token = localStorage.getItem(this.TOKEN_KEY);
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
      
      // For auth endpoints, don't try to refresh token on 401
      const isAuthEndpoint = endpoint.includes('/auth/login') || 
                            endpoint.includes('/auth/register') || 
                            endpoint.includes('/auth/refresh') ||
                            endpoint.includes('/auth/validate');
      
      // Handle 401 Unauthorized errors (except for auth endpoints)
      if (response.status === 401 && !isAuthEndpoint) {
        // Avoid multiple simultaneous refresh attempts
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          
          try {
            // Try to refresh the token using the authService
            // We need to import it dynamically to avoid circular dependency
            const { authService } = await import('./authService');
            const refreshed = await authService.refreshToken();
            
            this.isRefreshing = false;
            
            if (refreshed) {
              // Retry the original request with the new token
              return this.request<T>(endpoint, config);
            }
          } catch (refreshError) {
            this.isRefreshing = false;
            console.error('Token refresh failed:', refreshError);
            // Continue with the response processing instead of throwing
          }
        }
      }
      
      // For other statuses, try to parse JSON
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
        try {
          data = JSON.parse(data);
        } catch {
          // If it's not JSON, keep it as text
        }
      }
      
      // Check if the response is successful
      if (!response.ok) {
        // For auth endpoints, just pass through the error
        if (isAuthEndpoint) {
          return data as T;
        }
        
        throw new Error(
          data.message || data.error || 'An error occurred while making the request'
        );
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