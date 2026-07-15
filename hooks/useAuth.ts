import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as auth from '@/lib/auth';

export function useAuth(requireAuth: boolean = true) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = auth.isAuthenticated();

      if (requireAuth && !authenticated) {
        router.replace('/login');
      } else if (!requireAuth && authenticated) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.role === 'ADMIN') {
          router.replace('/admin');
        } else {
          router.replace('/');
        }
      }
      setIsLoading(false);
    };

    const timeoutId = setTimeout(checkAuth, 100);
    return () => clearTimeout(timeoutId);
  }, [router, requireAuth]);

  const logout = () => {
    auth.removeAuth();
    router.replace('/login');
  };

  return { logout, isLoading };
}

