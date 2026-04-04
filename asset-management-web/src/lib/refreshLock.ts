import { api } from "./axios";

// 🔐 REFRESH LOCK: Prevents multiple concurrent refresh requests. 
// Used by both axios interceptor and useInitializeAuth to share the same refresh call.

let refreshPromise: Promise<void> | null = null;

export function getOrStartRefresh(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = api
      .post("/api/auth/refresh")
      .then(() => { })
      .finally(() => {
        refreshPromise = null; // reset after settled so next expiry can refresh again
      });
  }
  return refreshPromise;
}
