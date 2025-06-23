// api/authorizedFetch.ts
export const authorizedFetch = async (
    input: RequestInfo,
    init: RequestInit = {},
    onUnauthorized?: () => void 
  ) => {
    const token = localStorage.getItem('auth_token');
  
    const headers = {
      ...init.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  
    const response = await fetch(input, {
      ...init,
      headers,
    });
  
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      if (onUnauthorized) onUnauthorized();
      throw new Error('Unauthorized');
    }
  
    return response;
  };