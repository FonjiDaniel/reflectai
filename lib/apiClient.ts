
"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { RefreshResponse } from "@/types/index";
import { config as Config } from "./config";

let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: Error | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(null); 
    }
  });
  failedQueue = [];
};

export const apiClient = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const { token } = useAuthStore.getState();

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    let response = await fetch(`${Config.backendBaseUrl}${url}`, config);

    if (response.status === 401 && url !== "/api/refresh") {

      if (isRefreshing) {
        // If already refreshing, add the current request to the queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            // Once refresh is done, retry the original request
            return apiClient(url, options);
          })
          .catch((err) => {
            // If refresh failed, propagate the error
            return Promise.reject(err);
          });
      }

      // Start refreshing
      isRefreshing = true;

      const { refreshToken } = useAuthStore.getState(); 
      const { logout, setAuth } = useAuthStore.getState(); 

      try {
        
        const refreshResponse = await fetch("/api/refresh-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        const refreshData : RefreshResponse = await refreshResponse.json();

        if (!refreshResponse.ok || !refreshData.success) {
          logout();
          processQueue(
            new Error("Failed to refresh token. Please log in again.")
          ); // Reject all queued requests
          return Promise.reject(new Error("Token refresh failed"));
        }

        // if Refresh is successful,  update tokens in Zustand and cookies
        if (!refreshData.data) {
          throw new Error("Invalid refresh data received");
        }
        const { token: newToken, refreshToken: newRefreshToken } =
          refreshData.data;

        setAuth(
          useAuthStore.getState().user!,
          newToken,
          newRefreshToken
        ); // Update Zustand store

        // Update cookies client-side
        document.cookie = `token=${newToken}; path=/; max-age=${7 * 24 * 60 * 60}; secure`; // Adjust max-age as needed
        document.cookie = `refreshToken=${newRefreshToken}; path=/; max-age=${7 * 24 * 60 * 60}; secure`; // Adjust max-age as needed
        document.cookie = `user=${JSON.stringify(useAuthStore.getState().user)}; path=/; max-age=${7 * 24 * 60 * 60}; secure`;

       
        processQueue(null); 

        const newHeaders = { ...headers, Authorization: `Bearer ${newToken}` };
        const newConfig = { ...config, headers: newHeaders };
        response = await fetch(`${Config.backendBaseUrl}${url}`, newConfig);
      } catch (refreshError) {
        console.error("Token refresh process failed:", refreshError);
        logout(); // Log out on error
        processQueue(refreshError as Error); // Reject all queued requests
        return Promise.reject(refreshError); // Reject the current request
      } finally {
        isRefreshing = false;
      }
    }

    // If not a 401 or it was the refreshed request, return the response
    return response;
  } catch (error) {
    console.error("API call error:", error);
    return Promise.reject(error); 
  }
};
