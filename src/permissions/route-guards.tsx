import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./auth-context";

function ProtectedRoute({ children }: PropsWithChildren) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function PublicOnlyRoute({ children }: PropsWithChildren) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const state = location.state as { from?: { pathname?: string } } | null;
  const fallbackPath = state?.from?.pathname ?? "/home";

  if (isAuthenticated) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
}

export { ProtectedRoute, PublicOnlyRoute };
