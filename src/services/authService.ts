import { httpClient } from './httpClient';
import { LoginFormData, RegisterFormData, AuthResponse } from '../types/auth.types';

// Authentication service class
class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly TOKEN_EXPIRY_KEY = 'token_expiry';

  // Login function
  async login(data: LoginFormData): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>('/auth/login', data);
      
      // Save token and user data
      this.saveAuthData(response);
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
  
  // Registration function
  async register(data: RegisterFormData): Promise<AuthResponse> {
    const { ...requestData } = data;
    
    try {
      const response = await httpClient.post<AuthResponse>('/auth/register', requestData);
      
      // Save token and user data
      this.saveAuthData(response);
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
  
  // Save authentication data
  private saveAuthData(response: AuthResponse): void {
    // Save token
    localStorage.setItem(this.TOKEN_KEY, response.access_token);
    
    // Handle user data - might be missing in some responses
    if (response.user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    } else if (response.access_token) {
      // If no user data but we have a token, try to extract user info from token
      const tokenData = this.parseJwt(response.access_token);
      if (tokenData) {
        const user = {
          id: tokenData.sub as string,
          email: tokenData.email as string,
          name: tokenData.firstName as string || tokenData.name as string || 'User'
        };
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      }
    }
    
    // If the response includes a refresh token, save it
    if ('refresh_token' in response) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, (response as AuthResponse & { refresh_token: string }).refresh_token);
    }
    
    // Calculate and store token expiry (default to 1 week if not provided)
    const expiresIn = (response as AuthResponse & { expires_in?: number }).expires_in || 604800; // 7 days in seconds (7*24*60*60)
    const expiryTime = Date.now() + expiresIn * 1000;
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
  }
  
  // Logout function
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
  }
  
  // Function to check user authentication
  checkAuth(): { isAuthenticated: boolean; user: AuthResponse['user'] | null } {
    const token = this.getToken();
    
    // If no token, user is not authenticated
    if (!token) {
      return { isAuthenticated: false, user: null };
    }
    
    // Check if token is expired based on JWT expiry
    const tokenData = this.parseJwt(token);
    if (tokenData && tokenData.exp) {
      const expiryTime = (tokenData.exp as number) * 1000; // Convert to milliseconds
      if (Date.now() >= expiryTime) {
        // Token is expired, but we'll still try to use it and refresh in the background
        this.refreshToken().catch(() => {
          console.log('Failed to refresh token silently');
        });
      }
    }
    
    // Try to get user data from localStorage
    try {
      const userJson = localStorage.getItem(this.USER_KEY);
      
      // If we have user data in localStorage, use it
      if (userJson) {
        const user = JSON.parse(userJson);
        return { isAuthenticated: true, user };
      } 
      // If no user data but we have a token, try to extract user info from token
      else if (token && tokenData) {
        const user = {
          id: tokenData.sub as string || 'unknown',
          email: tokenData.email as string || 'unknown',
          firstName: tokenData.firstName as string || undefined,
          name: tokenData.name as string || 'User'
        };
        // Save the extracted user data for future use
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        return { isAuthenticated: true, user };
      }
      
      // If we couldn't get user data, but we have a valid token, 
      // return authenticated with minimal user object
      return { 
        isAuthenticated: true, 
        user: { id: 'unknown', email: 'unknown', name: 'User' } 
      };
    } catch (e) {
      console.error('Error parsing user data:', e);
      // Don't log out the user, just return a default user object
      return { 
        isAuthenticated: true, 
        user: { id: 'unknown', email: 'unknown', name: 'User' } 
      };
    }
  }

  // Function to get the current token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  
  // Check if token is expired
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    
    // Check expiry from token payload
    const tokenData = this.parseJwt(token);
    if (tokenData && tokenData.exp) {
      const expiryTime = (tokenData.exp as number) * 1000; // Convert to milliseconds
      return Date.now() >= expiryTime;
    }
    
    // Fallback to stored expiry time
    const expiryTime = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (!expiryTime) return false; // If no expiry time, assume token is valid
    
    return parseInt(expiryTime, 10) < Date.now();
  }
  
  // Parse JWT token to get payload
  parseJwt(token: string): { [key: string]: unknown } | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error parsing JWT:', e);
      return null;
    }
  }
  
  // Validate token with the server
  async validateToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;
    
    // Check if token is expired based on JWT expiry
    const tokenData = this.parseJwt(token);
    if (!tokenData) return false;
    
    // If token has exp claim, check if it's expired
    if (tokenData.exp) {
      const expiryTime = (tokenData.exp as number) * 1000; // Convert to milliseconds
      if (Date.now() >= expiryTime) {
        // Token is expired, try to refresh it
        return this.refreshToken();
      }
    } 
    // If no exp claim or not expired, token is valid
    return true;
  }
  
  // Refresh the access token
  async refreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    if (!refreshToken) return false;
    
    try {
      // Call the refresh token endpoint
      const response = await httpClient.post<AuthResponse>('/auth/refresh', { 
        refresh_token: refreshToken 
      });
      
      // Save the new tokens
      this.saveAuthData(response);
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.logout();
      return false;
    }
  }
}

// Export service instance
export const authService = new AuthService(); 