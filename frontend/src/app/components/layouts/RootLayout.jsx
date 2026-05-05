import { Outlet, useLocation } from "react-router";
import { Sidebar } from "../Sidebar";
import { Navigation } from "../Navigation";
import { ChatAssistant } from "../ChatAssistant";
import { MobileNav } from "../MobileNav";

export function RootLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/";

  return (
    <div className="min-h-screen bg-[#0a0b14] text-white">
      {isAuthPage ? <Navigation /> : <Sidebar />}
      
      <main className={`transition-all duration-300 ${isAuthPage ? "pt-20" : "md:pl-64 pt-6"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-8">
          <Outlet />
        </div>
      </main>

      <MobileNav />
      <ChatAssistant />
    </div>
  );
}
