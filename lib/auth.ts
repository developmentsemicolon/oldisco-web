const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  const user = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  
  return !!(token && user);
}

export function removeAuth(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

  