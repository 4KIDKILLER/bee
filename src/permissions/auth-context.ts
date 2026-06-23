import { createContext, useContext } from "react";

interface LoginPayload {
  username: string;
  password: string;
}

interface LoginResult {
  token: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  isHydrated: boolean;
  token: string | null;
  login: (payload: LoginPayload) => Promise<LoginResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth 必须在 AuthProvider 内使用");
  }

  return context;
}

export { AuthContext, useAuth };
export type { AuthContextValue, LoginPayload, LoginResult };
