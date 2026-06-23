import { Route, Routes, BrowserRouter, useNavigate } from "react-router-dom";
import { Dock, BeeIcon } from "/@c/index";
import FolderList from "/@v/folder-list";
import Overview from "/@v/overview";
import { TooltipProvider } from "/@c/index";

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
    <>
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
    </>
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
