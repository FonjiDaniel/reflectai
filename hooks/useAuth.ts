
"use client"
import { useEffect } from 'react';
import { useAuth as useClerkAuth } from '@clerk/nextjs';
import { useAuthStore } from '@/store/useAuthStore';
import { AuthResponse } from '@/types/index';

interface UseAuthReturn {
  user: ReturnType<typeof useAuthStore>['user'];
  token: ReturnType<typeof useAuthStore>['token'];
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const { isSignedIn, isLoaded } = useClerkAuth();
  const { setAuth, user, token, isAuthenticated, logout } = useAuthStore();
  
  useEffect(() => {

    if (!isLoaded || !isSignedIn) {
      if (isLoaded && !isSignedIn && isAuthenticated) {
        logout();
      }
      return;
    }
    
    if (isAuthenticated && user && token) {
      return;
    }
    
    const syncAuth = async (): Promise<void> => {
      try {
        const response = await fetch('/api/sync-auth');
        const data = await response.json() as AuthResponse;
        
        if (data.success && data.data?.token && data.data?.user) {
          setAuth(data.data.user, data.data.token);
          console.log(data.data.token);
          console.log(data.message);
        } else {
          console.error('Auth sync failed:', data.message);
          logout();
        }
      } catch (error) {
        console.error('Auth sync error:', error);
        logout();
      }
    };
    
    syncAuth();
  }, [isLoaded, isSignedIn, isAuthenticated, user, token, setAuth, logout]);
  
  return {
    user,
    token,
    isAuthenticated,
    isLoading: !isLoaded || (isSignedIn && !isAuthenticated),
    logout
  };
}