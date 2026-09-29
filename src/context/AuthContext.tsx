import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  getSession,
  clearSession,
  impersonateUser as authImpersonate,
  stopImpersonating as authStopImpersonating,
  isImpersonating as authIsImpersonating,
} from '@/lib/auth';
import { initDb } from '@/lib/mockDb';
import type { AuthSession } from '@/types';

interface AuthContextValue {
  session: AuthSession | null;
  loading: boolean;
  refreshSession: () => void;
  logout: () => void;
  impersonate: (profileId: string) => boolean;
  stopImpersonate: () => boolean;
  isImpersonating: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  loading: true,
  refreshSession: () => {},
  logout: () => {},
  impersonate: () => false,
  stopImpersonate: () => false,
  isImpersonating: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  function refreshSession() {
    const s = getSession();
    setSession(s);
    setLoading(false);
  }

  function logout() {
    clearSession();
    setSession(null);
  }

  function impersonate(profileId: string): boolean {
    const s = authImpersonate(profileId);
    if (s) {
      setSession(s);
      return true;
    }
    return false;
  }

  function stopImpersonate(): boolean {
    const s = authStopImpersonating();
    if (s) {
      setSession(s);
      return true;
    }
    return false;
  }

  useEffect(() => {
    initDb();
    refreshSession();
  }, []);

  const isImpersonating = !!session?.impersonatedBy || authIsImpersonating();

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        refreshSession,
        logout,
        impersonate,
        stopImpersonate,
        isImpersonating,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useRequireAuth() {
  const { session, loading } = useAuth();
  return { session, loading, isAuthenticated: !!session };
}
