import { authStorage } from '../utils/auth';

export const requestInterceptor = (request: Request) => {
  const token = authStorage.getToken();
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }
  return request;
};

export const responseInterceptor = async (response: Response) => {
  if (response.status === 401) {
    authStorage.clear();
    window.location.href = '/auth/login';
    throw new Error('Session expired');
  }
  return response;
};
