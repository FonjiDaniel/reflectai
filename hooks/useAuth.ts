"use client";
import { useEffect } from "react";
import { useAuth as useClerkAuth } from "@clerk/nextjs";
import { useAuthStore, AuthState } from "@/store/useAuthStore";
import { AuthResponse } from "@/types/index";

export interface UseAuthReturn {
  user: AuthState["user"];
  token: AuthState["token"];
  refreshToken: AuthState["refreshToken"];
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
}

export function useMyAuth(): UseAuthReturn {
  const { isSignedIn, isLoaded, signOut } = useClerkAuth();
  const { setAuth, user, token, refreshToken, isAuthenticated, logout } =
    useAuthStore();

  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; Max-Age=0;`;
  };

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      if (isLoaded && !isSignedIn && isAuthenticated) {
        logout();
        deleteCookie("token");
        deleteCookie("user"); 
        deleteCookie("refreshToken");
      }
      return;
    }

    if (isAuthenticated && user && token && refreshToken) {
      console.log("Already authenticated, skipping sync");
      return;
    }

    const syncAuth = async (): Promise<void> => {
      try {
        const response = await fetch("/api/sync-auth", {
          credentials: "include",
          redirect: "manual"
        });


        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Non-JSON response:", text);
          throw new Error(`Received non-JSON response from /api/sync-auth (status: ${response.status})`);
        }
        const data = await response.json() as AuthResponse;
        if (data.success && data.data) {
          setAuth(data.data.user, data.data.token, data.data.refreshToken);
          document.cookie = `token=${data.data.token}; path=/; max-age=${7 * 24 * 60 * 60}; secure`;
          document.cookie = `refreshToken=${data.data.refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}; secure`;
          document.cookie = `user=${JSON.stringify(data.data.user)}; path=/; max-age=${7 * 24 * 60 * 60}; secure`;
        } else {
          console.error("Auth sync failed:", data.message);
          logout();
        }
      } catch (error) {
        console.error("Auth sync error in useAuth:", error);
        deleteCookie("token");
        deleteCookie("user");
        deleteCookie("refreshToken");
        logout();
        signOut();
      }
    };

    syncAuth();
  }, [
    isLoaded,
    isSignedIn,
    isAuthenticated,
    user,
    token,
    refreshToken,
    setAuth,
    logout,
    signOut,
  ]);

  return {
    user,
    token,
    refreshToken,
    isAuthenticated,
    isLoading: !isLoaded || (isSignedIn && !isAuthenticated),
    logout,
  };
}