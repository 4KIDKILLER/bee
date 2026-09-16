import { Suspense, lazy, useEffect, useMemo } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useSystemStore } from "../store/system/useSystemStore";
import { LogOut } from "lucide-react";
import { Dock, BeeIcon, BeeLoading, TooltipProvider, Toaster } from "/@c/index";
import { useAuth } from "../permissions/auth-context";
import { ProtectedRoute, PublicOnlyRoute } from "../permissions/route-guards";

const FolderList = lazy(() => import("/@v/folder-list"));
const Overview = lazy(() => import("/@v/overview"));
const Login = lazy(() => import("/@v/login"));

const LayoutContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isHydrated, logout } = useAuth();

  const items = useMemo(
    () => [
      {
        icon: <BeeIcon size={36} name="folder-fill" />,
        label: "BEE",
        onClick: () => navigate("/home"),
      },
      {
        icon: <BeeIcon size={36} name="disk" />,
        label: "磁盘概览",
        onClick: () => navigate("/overview"),
      },
      {
        icon: <LogOut className="size-6 text-white/85" />,
        label: "退出登录",
        onClick: () => {
          logout();
          navigate("/login", { replace: true });
        },
      },
    ],
    [logout, navigate],
  );

  const shouldShowDock = isAuthenticated && location.pathname !== "/login";

  if (!isHydrated) {
    return (
      <BeeLoading title="恢复登录中..." description="正在检查 BEE 会话状态" />
    );
  }

  return (
    <Suspense
      fallback={
        <BeeLoading title="页面加载中..." description="正在准备 BEE 工作台" />
      }
    >
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? "/home" : "/login"} replace />
          }
        />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <FolderList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/overview"
          element={
            <ProtectedRoute>
              <Overview />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? "/home" : "/login"} replace />
          }
        />
      </Routes>

      {shouldShowDock ? (
        <Dock
          items={items}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
      ) : null}
    </Suspense>
  );
};

const Layout = () => {
  const mode = useSystemStore((state) => state.mode);
  const updateModel = useSystemStore((state) => state.updateMode);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "b") {
        event.preventDefault();
        event.stopPropagation();

        if (event.repeat) {
          return;
        }

        updateModel(mode === "private" ? "default" : "private");
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [mode, updateModel]);

  return (
    <div className="relative h-full min-h-full w-full overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ease-in-out"
        style={{
          backgroundImage: "url('/wallpaper-default.png')",
          opacity: mode === "default" ? 1 : 0,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ease-in-out"
        style={{
          backgroundImage: "url('/wallpaper-private.png')",
          opacity: mode === "private" ? 1 : 0,
        }}
      />
      <div className="relative z-10 h-full min-h-full">
        <TooltipProvider>
          <BrowserRouter>
            <LayoutContent />
          </BrowserRouter>
        </TooltipProvider>
      </div>
      <span className="absolute bottom-[10px] right-[10px] z-20 bg-black/40 px-2 rounded-2xl text-white text-sm backdrop-blur-md">
        {import.meta.env.VITE_APP_VERSION}
      </span>
    </div>
  );
};

export default Layout;
