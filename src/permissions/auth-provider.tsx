import { useCallback, useMemo, useState, type PropsWithChildren } from "react";
import { AUTH_TOKEN_STORAGE_KEY } from "./constants";
import {
  AuthContext,
  type AuthContextValue,
  type LoginPayload,
  type LoginResult,
} from "./auth-context";

function readStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

  if (!token) {
    return null;
  }

  const normalizedToken = token.trim();

  if (!normalizedToken) {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    return null;
  }

  return normalizedToken;
}

function createMockJwtToken(username: string) {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: username,
      iat: Date.now(),
    }),
  );
  const signature = btoa(`bee-signature:${username}`);

  return `${header}.${payload}.${signature}`;
}

function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(() => readStoredToken());
  const isHydrated = true;

  const login = useCallback(
    async ({ username, password }: LoginPayload): Promise<LoginResult> => {
      const normalizedUsername = username.trim();
      const normalizedPassword = password.trim();

      if (!normalizedUsername || !normalizedPassword) {
        throw new Error("请输入账号和密码");
      }

      const nextToken = createMockJwtToken(normalizedUsername);

      window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, nextToken);
      setToken(nextToken);

      return { token: nextToken };
    },
    [],
  );

  const logout = useCallback(() => {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    setToken(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: !!token,
      isHydrated,
      token,
      login,
      logout,
    }),
    [isHydrated, login, logout, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider };
