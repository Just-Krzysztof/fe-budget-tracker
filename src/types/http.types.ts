// Request configuration interface
export interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
} 