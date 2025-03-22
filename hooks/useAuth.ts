
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

export function useMyAuth(): UseAuthReturn {
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


          //set user information for client side usage
          setAuth(data.data.user, data.data.token); 


          //store user information to cookie for server side usage  with a life span of 7days
          document.cookie = `token=${data.data.token}; path=/; max-age=${7 * 24 * 60 * 60}; secure`;
          document.cookie = `user=${JSON.stringify(data.data.user)}; path=/; max-age=${7 * 24 * 60 * 60}; secure`;
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