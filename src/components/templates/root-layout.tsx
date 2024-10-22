import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../layout/sidebar";
import clsx from "clsx";
import { MobileSidebar } from "../layout/mobile-sidebar";
import { Header } from "./header";
import { Footer } from "./footer";
import { useAuthHooks } from "./hooks/auth-hooks";

const PAGES_WITHOUT_SIDEBAR = ["/api-information", "/terms-and-privacy", "/help-center"];

function RootLayout() {
  useAuthHooks();

  const { pathname } = useLocation();

  const hideSidebar = PAGES_WITHOUT_SIDEBAR.includes(pathname);

  return (
    <>
      <Header />
      <div className="flex flex-col h-screen">
        <main id="main" className="container space-x-4 flex flex-1">
          <div
            className={clsx(
              "grid grid-cols-1 xl:grid-cols-[316px_minmax(600px,_1fr)] h-full pt-14 w-full gap-6 relative",
              hideSidebar && "xl:!grid-cols-1"
            )}
          >
            {hideSidebar ? null : <Sidebar />}
            <div className="xl:hidden absolute top-[85px] left-[-25px]">
              <MobileSidebar />
            </div>

            <Outlet />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default RootLayout;
