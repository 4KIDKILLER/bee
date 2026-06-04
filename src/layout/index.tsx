import { Route, Routes, BrowserRouter } from "react-router-dom";
import { StaggeredMenu } from "/@c/index";
import FolderList from "/@v/folder-list";
import Personal from "/@v/personal";
import Overview from "/@v/overview";
import Settings from "/@v/settings";
import RecycleBin from "/@v/recycle-bin";

const menuItems = [
  { label: "相册首页", ariaLabel: "BEE Home", link: "/" },
  { label: "个人信息", ariaLabel: "Personal information", link: "/personal" },
  { label: "系统概览", ariaLabel: "System overview", link: "/overview" },
  { label: "系统设置", ariaLabel: "System settings", link: "/settings" },
  { label: "回收站", ariaLabel: "Recycle bin", link: "/recycle-bin" },
];

const socialItems = [
  { label: "Twitter", link: "https://twitter.com" },
  { label: "GitHub", link: "https://github.com" },
  { label: "LinkedIn", link: "https://linkedin.com" },
];

const Layout = () => {
  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FolderList />} />
          <Route path="/personal" element={<Personal />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/recycle-bin" element={<RecycleBin />} />
        </Routes>
      </BrowserRouter>
      <StaggeredMenu
        position="right"
        isFixed
        items={menuItems}
        socialItems={socialItems}
        displaySocials
        displayItemNumbering={true}
        openMenuButtonColor="#000"
        changeMenuColorOnOpen={true}
        colors={["#B19EEF", "#5227FF"]}
        accentColor="#5227FF"
        onMenuOpen={() => console.log("Menu opened")}
        onMenuClose={() => console.log("Menu closed")}
      />
    </div>
  );
};

export default Layout;
