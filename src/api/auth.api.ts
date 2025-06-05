import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from '../types/auth.types';

export const API_URL = 'http://localhost:3000';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  },

  logout: async (): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  },

  me: async (token: string): Promise<AuthResponse['user']> => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch user data');
    return response.json();
  },
};
