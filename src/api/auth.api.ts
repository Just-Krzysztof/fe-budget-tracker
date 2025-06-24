import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from '../types/auth.types';
import { authStorage } from '../utils/auth';
import { parseJwt } from '../utils/parseJwt';
export const API_URL = 'http://localhost:3000';

interface BackendAuthResponse {
  accessToken: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) throw new Error('Login failed');

    const data: BackendAuthResponse = await response.json();

    const tokenData = parseJwt(data.accessToken);

    return {
      accessToken: data.accessToken,
      user: {
        id: tokenData.sub,
        email: credentials.email,
        name: tokenData.name || credentials.email.split('@')[0],
      },
    };
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
    const token = authStorage.getToken();
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
};
