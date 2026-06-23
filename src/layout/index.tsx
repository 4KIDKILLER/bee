import { Suspense, lazy } from "react";
import { Route, Routes, BrowserRouter, useNavigate } from "react-router-dom";
import { Dock, BeeIcon, BeeLoading, TooltipProvider } from "/@c/index";

const FolderList = lazy(() => import("/@v/folder-list"));
const Overview = lazy(() => import("/@v/overview"));

const LayoutContent = () => {
  const navigate = useNavigate();
  const items = [
    {
      icon: <BeeIcon size={36} name="folder-fill" />,
      label: "BEE",
      onClick: () => navigate("/"),
    },
    {
      icon: <BeeIcon size={36} name="disk" />,
      label: "磁盘概览",
      onClick: () => navigate("/overview"),
    },
  ];

  return (
    <Suspense
      fallback={
        <BeeLoading
          title="页面加载中..."
          description="正在准备 BEE 工作台"
        />
      }
    >
      <Routes>
        <Route path="/" element={<FolderList />} />
        <Route path="/overview" element={<Overview />} />
      </Routes>

      <Dock
        items={items}
        panelHeight={68}
        baseItemSize={50}
        magnification={70}
      />
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
