import { useCallback, useMemo, useState, type PropsWithChildren } from "react";
import { AUTH_TOKEN_STORAGE_KEY } from "./constants";
import {
  AuthContext,
  type AuthContextValue,
  type LoginPayload,
  type LoginResult,
} from "./auth-context";
import { UserApi } from "/@/api/user";

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

function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(() => readStoredToken());
  const isHydrated = true;

  const login = useCallback(
    async ({ username, password }: LoginPayload): Promise<LoginResult> => {
      const normalizedUsername = username.trim();
      const normalizedPassword = password.trim();

      const response = await UserApi.loginApi({
        username: normalizedUsername,
        password: normalizedPassword,
      });
      const nextToken = response.data.token.trim();

      if (!nextToken) {
        throw new Error("登录接口未返回有效令牌");
      }

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
