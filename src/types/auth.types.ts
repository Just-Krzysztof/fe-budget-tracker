// Login form data interface
export interface LoginFormData {
  email: string;
  password: string;
}

// Registration form data interface
export interface RegisterFormData {
  email: string;
  password: string;
  firstName: string;
}

// User interface
export interface User {
  id: string;
  email: string;
  firstName?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Authentication response interface
export interface AuthResponse {
  access_token: string;
  user: User;
  refresh_token?: string;
  expires_in?: number;
}

// Authentication context type
export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (data: LoginFormData) => Promise<AuthResponse>;
  register: (data: RegisterFormData) => Promise<AuthResponse>;
  logout: () => void;
}

// Authentication provider props
export interface AuthProviderProps {
  children: React.ReactNode;
} 