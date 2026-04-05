import { useEffect, useState } from "react";
import { getOrStartRefresh } from "../lib/refreshLock";
import { useAuthStore } from "../store/authStore";
import { viewProfileApi } from "../services/auth.service";
import { AxiosError } from "axios";

export function useInitializeAuth(): boolean {
  const { token, setUser } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(!token);

  useEffect(() => {
    if (token) {
      setIsInitializing(false);
      return;
    }

    let cancelled = false;

    async function checkSession() {
      try {
        // Check if the access token cookie is still valid
        const data = await viewProfileApi();
        if (!cancelled) {
          setUser(data);
        }
      } catch (err) {
        const status = (err as AxiosError)?.response?.status;

        if (status === 401) {
          // 🤫 Silent Refresh: Uses the shared lock to refresh tokens securely
          // without conflicting with the axios interceptor.
          try {
            await getOrStartRefresh();
            const retryData = await viewProfileApi();
            if (!cancelled) {
              setUser(retryData);
            }
          } catch {
            // Refresh token also expired — store stays empty, ProtectedRoute redirects
          }
        }
      } finally {
        if (!cancelled) {
          setIsInitializing(false);
        }
      }
    }

    checkSession();

    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return isInitializing;
}
