import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

/**
 * AppLayout — shared shell for all protected pages.
 * Renders the collapsible Sidebar on the left and the page content on the right.
 * The main area's left padding tracks the sidebar width automatically via a 
 * custom event from the Sidebar.
 */
export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsMobileMenuOpen(false);
    };

    window.addEventListener("resize", handleResize);
    const sidebarHandler = (e: CustomEvent<{ collapsed: boolean }>) => {
      setCollapsed(e.detail.collapsed);
    };

    window.addEventListener("sidebar-toggle" as any, sidebarHandler);
    window.addEventListener("toggle-mobile-menu" as any, () => setIsMobileMenuOpen(prev => !prev));

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("sidebar-toggle" as any, sidebarHandler);
      window.removeEventListener("toggle-mobile-menu" as any, () => { });
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      <Sidebar isMobileOpen={isMobileMenuOpen} setIsMobileOpen={setIsMobileMenuOpen} />

      {/* Main content shifts right by sidebar width on desktop only */}
      <div
        className="flex-1 min-h-screen transition-all duration-300 ease-in-out flex flex-col w-full"
        style={{ marginLeft: isMobile ? "0" : (collapsed ? "80px" : "260px") }}
      >
        <Header collapsed={collapsed} isMobile={isMobile} />
        <main className="flex-1 transition-all duration-300 pt-20 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[45] backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
