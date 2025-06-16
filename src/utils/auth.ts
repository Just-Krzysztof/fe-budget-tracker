export const TOKEN_KEY = 'auth_token';

export interface User {
  id: string;
  email: string;
  name: string;
}

export const authStorage = {
  // Token
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (accessToken: string) =>
    localStorage.setItem(TOKEN_KEY, accessToken),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),

  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
};
console.log('authStorage.isAuthenticated', authStorage.isAuthenticated);

console.log(
  '!!localStorage.getItem(TOKEN_KEY)',
  !!localStorage.getItem(TOKEN_KEY)
);
