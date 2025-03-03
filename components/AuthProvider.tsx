"use client"
import React, { ReactNode, JSX } from 'react';
import { useAuth } from '@/hooks/useAuth';
import FullPageLoader from './Loader';



interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const { isLoading } = useAuth();
  
  if (isLoading) {
    return <FullPageLoader/>
  }
  
  return <>{children}</>;
}