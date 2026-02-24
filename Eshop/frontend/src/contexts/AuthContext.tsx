import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import toast from "react-hot-toast";

const API = "http://localhost:30001";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem("studio_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("studio_token")
  );
  const [isLoading, setIsLoading] = useState(false);

  const saveAuth = (u: AuthUser, t: string) => {
    setUser(u);
    setToken(t);
    localStorage.setItem("studio_user", JSON.stringify(u));
    localStorage.setItem("studio_token", t);
  };

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.detail || "Invalid credentials");
        return false;
      }
      const data = await res.json();
      saveAuth(data.user, data.access);
      toast.success(`Welcome back, ${data.user.username}!`);
      return true;
    } catch {
      toast.error("Network error");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        const msg = Object.values(data).flat().join(", ");
        toast.error(msg || "Registration failed");
        return false;
      }
      const data = await res.json();
      saveAuth(data.user, data.access);
      toast.success(`Account created! Welcome, ${data.user.username}.`);
      return true;
    } catch {
      toast.error("Network error");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("studio_user");
    localStorage.removeItem("studio_token");
    toast("Logged out");
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
