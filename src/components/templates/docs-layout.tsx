import { Outlet } from "react-router-dom";
import { Header } from "./header";
import { Footer } from "./footer";
import { useAuthHooks } from "./hooks/auth-hooks";

function DocsLayout() {
  useAuthHooks();
  return (
    <main className="h-screen dark:docs-bg-image">
      <Header />
      <div className="pt-14">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
}

export default DocsLayout;
