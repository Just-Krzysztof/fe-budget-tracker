import { httpClient } from './httpClient';
import { LoginFormData, RegisterFormData, AuthResponse } from '../types/auth.types';

// Authentication service class
class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  
  // Login function
  async login(data: LoginFormData): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>('/auth/login', data);
      
      // Save token and user data
      localStorage.setItem(this.TOKEN_KEY, response.access_token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
      
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
      localStorage.setItem(this.TOKEN_KEY, response.access_token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
  
  // Logout function
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
  
  // Function to check user authentication
  checkAuth(): { isAuthenticated: boolean; user: AuthResponse['user'] | null } {
    const token = this.getToken();
    const userJson = localStorage.getItem(this.USER_KEY);
    
    if (!token || !userJson) {
      return { isAuthenticated: false, user: null };
    }
    
    try {
      const user = JSON.parse(userJson);
      return { isAuthenticated: true, user };
    } catch (e) {
      console.error('Error parsing user data:', e);
      this.logout(); // In case of JSON parsing error, log out the user
      return { isAuthenticated: false, user: null };
    }
  }

  // Function to get the current token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}

// Export service instance
export const authService = new AuthService(); 