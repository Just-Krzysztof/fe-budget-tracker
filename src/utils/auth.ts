export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'user';
export interface User {
  id: string;
  email: string;
  name: string;
}

export const authStorage = {
  // Token
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getUser: () => {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  setToken: (accessToken: string, user: User) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
};
