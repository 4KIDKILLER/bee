import { Suspense, lazy, useMemo } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { LogOut } from "lucide-react";
import { Dock, BeeIcon, BeeLoading, TooltipProvider } from "/@c/index";
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
    return <BeeLoading title="恢复登录中..." description="正在检查 BEE 会话状态" />;
  }

  return (
    <Suspense
      fallback={
        <BeeLoading title="页面加载中..." description="正在准备 BEE 工作台" />
      }
    >
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
  return (
    <div className="relative h-full min-h-full w-full overflow-hidden">
      <TooltipProvider>
        <BrowserRouter>
          <LayoutContent />
        </BrowserRouter>
      </TooltipProvider>
    </div>
  );
};

export default Layout;
