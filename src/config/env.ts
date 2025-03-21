// Environment configuration
interface EnvConfig {
  API_URL: string;
  NODE_ENV: string;
  APP_VERSION: string;
  JWT_EXPIRY_TIME: number;
}

// Default values
const defaultConfig: EnvConfig = {
  API_URL: 'http://localhost:3000',
  NODE_ENV: 'development',
  APP_VERSION: '1.0.0',
  JWT_EXPIRY_TIME: 604800, // 7 days in seconds
};

// Load environment variables from import.meta.env (Vite)
const env: EnvConfig = {
  API_URL: (import.meta.env?.VITE_API_URL as string) || defaultConfig.API_URL,
  NODE_ENV: (import.meta.env?.MODE as string) || defaultConfig.NODE_ENV,
  APP_VERSION: (import.meta.env?.VITE_APP_VERSION as string) || defaultConfig.APP_VERSION,
  JWT_EXPIRY_TIME: parseInt(import.meta.env?.VITE_JWT_EXPIRY_TIME as string) || defaultConfig.JWT_EXPIRY_TIME,
};

export default env; 