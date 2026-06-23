import { Route, Routes, BrowserRouter } from "react-router-dom";
import { StaggeredMenu } from "/@c/index";
import FolderList from "/@v/folder-list";
import Personal from "/@v/personal";
import Overview from "/@v/overview";
import { TooltipProvider } from "/@c/index";

const menuItems = [
  { label: "BEE相册", ariaLabel: "BEE Home", link: "/" },
  { label: "个人信息", ariaLabel: "Personal information", link: "/personal" },
  { label: "系统概览", ariaLabel: "System overview", link: "/overview" },
];

const socialItems = [
  { label: "Twitter", link: "https://twitter.com" },
  { label: "GitHub", link: "https://github.com" },
  { label: "LinkedIn", link: "https://linkedin.com" },
];

const Layout = () => {
  return (
    <div className="relative h-full min-h-full w-full overflow-hidden">
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<FolderList />} />
            <Route path="/personal" element={<Personal />} />
            <Route path="/overview" element={<Overview />} />
          </Routes>

          <StaggeredMenu
            position="right"
            isFixed
            items={menuItems}
            socialItems={socialItems}
            displaySocials
            logoUrl="/avatar.jpg"
            displayItemNumbering={true}
            openMenuButtonColor="#000"
            changeMenuColorOnOpen={true}
            colors={["#B19EEF", "#5227FF"]}
            accentColor="#5227FF"
            onMenuOpen={() => console.log("Menu opened")}
            onMenuClose={() => console.log("Menu closed")}
          />
        </BrowserRouter>
      </TooltipProvider>
    </div>
  );
};

export default Layout;
