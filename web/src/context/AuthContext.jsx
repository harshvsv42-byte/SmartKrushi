/**
 * AuthContext: manages authentication state, tokens, and user profile globally.
 * Provides login, logout, and profile update operations to all child components.
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, profileApi } from '../api/services';
import i18n from '../i18n';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // profile data from backend
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // initial auth check

  // ── Load session on mount ────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Token exists — fetch profile to validate session
      profileApi.get()
        .then((res) => {
          setUser(res.data);
          setIsAuthenticated(true);
          // Restore the user's preferred language
          if (res.data.preferred_language) {
            i18n.changeLanguage(res.data.preferred_language);
          }
        })
        .catch(() => {
          // Token invalid or expired — clear session
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setIsAuthenticated(false);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  // ── Listen for session expiry event from the API client ──────────────────
  useEffect(() => {
    const handleExpiry = () => {
      setUser(null);
      setIsAuthenticated(false);
    };
    window.addEventListener('auth:session-expired', handleExpiry);
    return () => window.removeEventListener('auth:session-expired', handleExpiry);
  }, []);

  // ── Login: called after successful authentication ──────────────────────
  const login = useCallback((tokens, profile) => {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    setUser(profile);
    setIsAuthenticated(true);
    // Apply preferred language immediately
    if (profile?.preferred_language) {
      i18n.changeLanguage(profile.preferred_language);
    }
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch {
      // Ignore errors on logout — still clear client state
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  // ── Update profile locally after a PATCH ─────────────────────────────────
  const updateProfile = useCallback((updatedProfile) => {
    setUser((prev) => ({ ...prev, ...updatedProfile }));
    if (updatedProfile.preferred_language) {
      i18n.changeLanguage(updatedProfile.preferred_language);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
